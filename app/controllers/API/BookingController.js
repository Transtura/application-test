const Controller = require("../../controllers/Controller");

/* Validator Modules */
const BookingValidator = require("../../../validators/Booking");

/* Model Modules */
const BookingModel = require("../../models/Booking");
const BusModel = require("../../models/Bus");
const Helpers = require("../../../utils/Helpers");

class BookingController extends Controller {
  constructor() {
    super();
  }

  async searchBooking(req, res, next) {
    try {
      const Body = req.body;

      const Validator = await BookingValidator.searchBooking(
        Body,
        BookingModel
      );
      if (Validator.status) {
        return super.sendErrorResponse(
          res,
          Validator.errors,
          "Booking Failed",
          400
        );
      }

      /* Search For Available Rides */
      const Booking = await BookingModel.findOne({
        from: {
          $regex: `.*${Body.from}.*`,
        },
        to: {
          $regex: `.*${Body.to}.*`,
        },
      });

      /* Prepare The Response */
      const statusId = await Helpers.fetchStatusId("Active");
      const Buses = await BusModel.find({ statusId });
      const Data = {
        bookingMatch: Booking,
        buses: Buses,
      };

      return super.sendSuccessResponse(
        res,
        Data,
        "Bookings Retrieved Successfully!",
        200
      );
    } catch (err) {
      console.log(err);
      return super.sendServerError(
        res,
        "Sorry, something went wrong! Please, try again"
      );
    }
  }

  async makeBooking(req, res, next) {
    try {
      const Body = req.body;
      Body.rider = req.rider;

      const Validator = await BookingValidator.createBooking(
        Body,
        BookingModel
      );

      /* Check The Validator For Errors */
      if (Validator.status) {
        return super.sendErrorResponse(
          res,
          Validator.errors,
          "Booking Failed",
          400
        );
      }

      /* Create The Booking */
      const StatusId = await Helpers.fetchStatusId("Pending");
      const Bus = await BusModel.findById(Body.busId);

      /* Do The Booking Calculation */
      const availableSeats = await Helpers.calculateBookingSeats(
        Body.busId,
        Body.seatsRequested,
        StatusId
      );

      if (Math.abs(availableSeats) < 1) {
        return super.sendErrorResponse(res, {
          seats: "No seats available! Please, check again later.",
        });
      }

      const Booking = new BookingModel({
        riderId: Body.rider._id.toString(),
        from: Body.from,
        to: Body.to,
        busId: Body.busId,
        driverId: Bus._id.toString(),
        seatsRequested: Body.seatsRequested,
        seatsAvailable: availableSeats,
        statusId: StatusId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      let newBooking = await Booking.save();

      /* Send Back The Success Response */
      return super.sendSuccessResponse(
        res,
        newBooking,
        "Booking Created Successfully!",
        201
      );
    } catch (err) {
      console.log(err);
      return super.sendServerError(
        res,
        "Sorry, something went wrong! Please, try again"
      );
    }
  }

  async confirmBooking(req, res, next) {
    try {
      const Body = req.params;

      /* Validate The Booking */
      const Validator = await BookingValidator.confirmBooking(
        Body,
        BookingModel
      );
      if (Validator.status) {
        return super.sendErrorResponse(
          res,
          Validator.errors,
          "Failed to confirm booking!",
          400
        );
      }

      /* Confirm The Model Owner */
      if (!req.driver) {
        return super.sendErrorResponse(
          res,
          {
            driver: "Sorry, Only a driver is allowed to confirm this request!",
          },
          "Unauthorized Request",
          400
        );
      }

      /* Update The Booking Status */
      const Booking = await BookingModel.findById(Body.bookingId);
      Booking.driverId = req.driver._id.toString();
      Booking.statusId = await Helpers.fetchStatusId("In Progress");
      await Booking.save();

      /* Send Back the Response */
      return super.sendSuccessResponse(
        res,
        Booking,
        "Booking Updated Successfully!",
        200
      );
    } catch (err) {
      console.log(err);
      return super.sendServerError(
        res,
        "Sorry, something went wrong! Please, try again"
      );
    }
  }

  async startBooking(req, res, next) {
    try {
      const Body = req.params;

      /* Validate The Booking */
      const Validator = await BookingValidator.confirmBooking(
        Body,
        BookingModel
      );
      if (Validator.status) {
        return super.sendErrorResponse(
          res,
          Validator.errors,
          "Failed to start booking!",
          400
        );
      }

       /* Confirm The Model Owner */
       if (!req.driver) {
        return super.sendErrorResponse(
          res,
          {
            driver: "Sorry, Only a driver is allowed to start this request!",
          },
          "Unauthorized Request",
          400
        );
      }

      /* Update The Booking Status */
      const Booking = await BookingModel.findById(Body.bookingId);

      /* Confirm The Driver Own's The Booking */
      if (Booking.driverId != req.driver._id.toString()) {
        return super.sendErrorResponse(res, { driver: 'You are not allowed to perform this action' }, 'Unaithorized!', 400);
      }

      Booking.statusId = await Helpers.fetchStatusId("Active");
      await Booking.save();
      
      /* Send Back the Response */
      return super.sendSuccessResponse(
        res,
        Booking,
        "Booking Updated Successfully!",
        200
      );
    } catch (err) {
      console.log(err);
      return super.sendServerError(
        res,
        "Sorry, something went wrong! Please, try again"
      );
    }
  }

  async cancelBooking(req, res, next) {
    try {
      const Body = req.params;

      /* Validate The Booking */
      const Validator = await BookingValidator.confirmBooking(
        Body,
        BookingModel
      );
      if (Validator.status) {
        return super.sendErrorResponse(
          res,
          Validator.errors,
          "Failed to start booking!",
          400
        );
      }

       /* Confirm The Model Owner */
       if (!req.rider) {
        return super.sendErrorResponse(
          res,
          {
            rider: "Sorry, Only a Rider is allowed to cancel this request!",
          },
          "Unauthorized Request",
          400
        );
      }

      /* Update The Booking Status */
      const Booking = await BookingModel.findById(Body.bookingId);
      
      /* Confirm The Rider Own's The Booking */
      if (Booking.riderId != req.rider._id.toString()) {
        return super.sendErrorResponse(res, { rider: 'You are not allowed to perform this action' }, 'Unaithorized!', 400);
      }

      Booking.statusId = await Helpers.fetchStatusId("Cancelled");
      Booking.seatsAvailable = Booking.seatsAvailable + Booking.seatsRequested;
      await Booking.save();

      /* Send Back the Response */
      return super.sendSuccessResponse(
        res,
        Booking,
        "Booking Updated Successfully!",
        200
      );
    } catch (err) {
      console.log(err);
      return super.sendServerError(
        res,
        "Sorry, something went wrong! Please, try again"
      );
    }
  }

  async completeBooking(req, res, next) {
    try {
      const Body = req.params;

      /* Validate The Booking */
      const Validator = await BookingValidator.cancelBooking(
        Body,
        BookingModel
      );
      if (Validator.status) {
        return super.sendErrorResponse(
          res,
          Validator.errors,
          "Failed to complete booking!",
          400
        );
      }

      /* Confirm The Model Owner */
      if (!req.rider) {
        return super.sendErrorResponse(
          res,
          {
            rider: "Sorry, Only a Rider is allowed to cancel this request!",
          },
          "Unauthorized Request",
          400
        );
      }

      /* Update The Booking Status */
      const Booking = await BookingModel.findById(Body.bookingId);
      Booking.statusId = await Helpers.fetchStatusId("Completed");

       /* Confirm The Rider Own's The Booking */
       if (Booking.riderId != req.rider._id.toString()) {
        return super.sendErrorResponse(res, { rider: 'You are not allowed to perform this action' }, 'Unaithorized!', 400);
      }
      
      Booking.seatsAvailable = Booking.seatsAvailable + Booking.seatsRequested;

      /* Save The Booking */
      await Booking.save();

      /* Send Back the Response */
      return super.sendSuccessResponse(
        res,
        Booking,
        "Booking Updated Successfully!",
        200
      );
    } catch (err) {
      console.log(err);
      return super.sendServerError(
        res,
        "Sorry, something went wrong! Please, try again"
      );
    }
  }
}

module.exports = new BookingController();
