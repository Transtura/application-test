const Mongoose = require('mongoose');
const Schema = require('../../database/schema/BookingSchema');

class Booking {
  booking() {
    const BookingModel = Mongoose.model.Booking || Mongoose.model('Booking', Schema);
    return BookingModel;
  }
}
module.exports = new Booking().booking();