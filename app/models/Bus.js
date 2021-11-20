const Mongoose = require('mongoose');
const Schema = require('../../database/schema/BusesSchema');

class Bus {
  bus() {
    const StatusModel = Mongoose.model.Bus || Mongoose.model('Bus', Schema);
    return StatusModel;
  }
}
module.exports = new Bus().bus();