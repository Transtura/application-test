const BookingModel = require('../app/models/Booking');
const StatusModel = require("../app/models/Status");
const UserModel = require("../app/models/User");
const BusModel = require('../app/models/Bus');
class Helpers {
  async fetchStatusId(statusName = "Active") {
    try {
      const Status = await StatusModel.findOne({ name: statusName }).lean();

      return Status._id.toString();
    } catch (err) {
      return null;
    }
  }

  async fetchStatusName(statusId) {
    try {
      const Status = await StatusModel.findById(statusId).lean();

      return Status.name;
    } catch (err) {
      return null;
    }
  }

  async findUserByEmail(email = "") {
    try {
      const User = await UserModel.findOne({ email: email }).lean();

      return User;
    } catch (err) {
      return null;
    }
  }

  async findUserByPhone(phoneNumber = "") {
    try {
      const User = await UserModel.findOne({ phone: phoneNumber }).lean();

      return User;
    } catch (err) {
      return null;
    }
  }

  randomStringGenerator(length = 6) {
    let result = "";
    const Characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const CharactersLength = Characters.length;

    /* Max Allowed Chars */
    if (length >= 500) {
      length = 500;
    }

    // Shuffle The Characters String According To The Passed In The Length...
    for (var i = 0; i < length; i++) {
      result += Characters.charAt(Math.floor(Math.random() * CharactersLength));
    }

    // Return The Generated String...
    return result;
  }

  async calculateBookingSeats(busId, seatsRequested, statusId = '') {
    try {
      const Booking = await BookingModel.findOne({ busId: busId, statusId }, null, { sort: { _id: -1 } })
        .lean();
      const Bus = await BusModel.findById(busId)
        .lean();

      if (Booking) {
        return parseInt(Booking.seatsAvailable) - parseInt(seatsRequested)
      }

      if (Bus && Bus.statusId) {
        return parseInt(Bus.seats) - parseInt(seatsRequested);
      }
    } catch (err) { return null; }
  }
}

module.exports = new Helpers();
