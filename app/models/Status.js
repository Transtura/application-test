const Mongoose = require('mongoose');
const Schema = require('../../database/schema/StatusSchema');

class Status {
  status() {
    const StatusModel = Mongoose.model.Status || Mongoose.model('Status', Schema);
    return StatusModel;
  }
}
module.exports = new Status().status();