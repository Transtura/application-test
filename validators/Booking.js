const Base = require("./Base");

const Helpers = require("../utils/Helpers");
const BusModel = require('../app/models/Bus');

class Booking extends Base {
  constructor() {
    super();
    this.Response = { status: false, errors: {} };
  }

  async searchBooking(Payload, Model) {
    try {
      if (!Payload.from) {
        this.Response.status = true;
        this.Response.errors.from =
          "Sorry, Your origin destination is required!";

        return this.Response;
      }

      if (!Payload.to) {
        this.Response.status = true;
        this.Response.errors.from =
          "Sorry, Your final destination is required!";

        return this.Response;
      }

      return this.Response = { status: false, errors: {} };
    } catch (err) {
      (this.Response.status = true),
        (this.Response.errors = {
          keys: "Sorry, Please, check your request body and try again!",
        });

      /* Send Back The Error Response */
      return this.Response;
    }
  }

  async createBooking(Payload, Model) {
    try {
      if (!Payload.from) {
        this.Response.status = true;
        this.Response.errors.from =
          "Sorry, Your origin destination is required!";

         return this.Response;
      }

      if (!Payload.to) {
        this.Response.status = true;
        this.Response.errors.from =
          "Sorry, Your final destination is required!";

         return this.Response;
      }

      /* Query The Status ID */
      let activeStatusId = await Helpers.fetchStatusId("Active");
      let pendingStatusId = await Helpers.fetchStatusId("Pending");

      /* Confirm the selected bus is available & active */
      const checkBusStatus = await BusModel.findById(Payload.busId);
      if (checkBusStatus && checkBusStatus.statusId != activeStatusId) {
        this.Response.status = true;
        this.Response.errors.bus = 'Sorry, The selected bus is not available! Please, select another bus.';

       return this.Response;
      }

      /* Check For Bookings */
      const hasBooking = await Model.findOne({
        riderId: Payload.rider._id.toString(),
        $or: [{ statusId: activeStatusId }, { statusId: pendingStatusId }],
      }).lean();

      if (hasBooking) {
        this.Response.status = true;
        this.Response.errors.booking = "Sorry, You already have a booking!";

         return this.Response;
      }

      /* Confirm The Seat Requested Isn't Higher Than The Available Seats */
      const lastSeatTotal = await Model.findOne({
        busId: Payload.busId,
      }, null, { sort: { _id: -1 } }).lean();

      if (lastSeatTotal) {
        if (Math.abs(lastSeatTotal.seatsAvailable) < Payload.seatsRequested) {
          this.Response.status = true;
          this.Response.errors.seatsAvailable = 'Sorry, You can only request a maximum of ' + lastSeatTotal.seatsAvailable + '!';

           return this.Response;
        }
      }

      return this.Response = { status: false, errors: {} };
    } catch (err) {
      console.log(err);
      (this.Response.status = true),
        (this.Response.errors = {
          keys: "Sorry, Please, check your request body and try again!",
        });

      /* Send Back The Error Response */
      return this.Response;
    }
  }

  async confirmBooking(Payload, Model) {
    try {
      const Booking = await Model.findById(Payload.bookingId)
        .lean();
      
      if (!Booking) {
        this.Response.status = true;
        this.Response.errors.bookingId = 'Sorry, The selected booking is Unavailable';
        
        return this.Response;
      }

      const statusId = await Helpers.fetchStatusId('Cancelled');
      if (Booking.statusId == statusId) {
        this.Response.status = true;
        this.Response.errors.bookingId = 'Sorry, The selected booking has been cancelled by the rider!';
        
        return this.Response;
      }

      return this.Response = { status: false, errors: {} };
    } catch (err) {
      console.log(err);
      (this.Response.status = true),
        (this.Response.errors = {
          keys: "Sorry, Please, check your request body and try again!",
        });

      /* Send Back The Error Response */
      return this.Response;
    }
  }
  
  async cancelBooking(Payload, Model) {
    try {
      const Booking = await Model.findById(Payload.bookingId)
        .lean();
      
      if (!Booking) {
        this.Response.status = true;
        this.Response.errors.bookingId = 'Sorry, The selected booking is Unavailable';
        
        return this.Response;
      }

      if (Booking) {
        const statusId = await Helpers.fetchStatusId('Active');
        if (statusId == Booking.statusId) {
          this.Response.status = true;
          this.Response.errors.bookingId = 'Sorry, Only a pending ride can be cancelled. Please, contact admin';
          
          return this.Response;
        }
      }

      return this.Response = { status: false, errors: {} };
    } catch (err) {
      (this.Response.status = true),
        (this.Response.errors = {
          keys: "Sorry, Please, check your request body and try again!",
        });

      /* Send Back The Error Response */
      return this.Response;
    }
  }

  async completeBooking(Payload, Model) {
    try {
      const Booking = await Model.booking.findById(Payload.bookingId)
        .lean();
      
      if (!Booking) {
        this.Response.status = true;
        this.Response.errors.bookingId = 'Sorry, The selected booking is Unavailable';
        
        return this.Response;
      }

      const statusId = await Helpers.fetchStatusId('Cancelled');
      if (Booking.statusId == statusId) {
        this.Response.status = true;
        this.Response.errors.bookingId = 'Sorry, The selected booking has been cancelled by the rider!';
        
        return this.Response;
      }

      return this.Response = { status: false, errors: {} };
    } catch (err) {
      (this.Response.status = true),
        (this.Response.errors = {
          keys: "Sorry, Please, check your request body and try again!",
        });

      /* Send Back The Error Response */
      return this.Response;
    }
  }
}

module.exports = new Booking();
