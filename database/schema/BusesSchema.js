const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

module.exports = new Schema({
  serialNo: {
    type: String,
    unique: true,
    required: true
  },
  seats: {
    type: Number,
    required: true,
    default: 5
  },
  driverId: {
    type: String,
    unique: true,
    required: true
  },
  plateNo: {
    type: String,
    required: true,
    unique: true
  },
  statusId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    required: false,
    default: Date.now()
  }
});