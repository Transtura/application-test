const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

module.exports = new Schema({
  riderId: {
    type: String,
    required: true
  },
  busId: {
    type: String,
    required: false,
    default: null
  },
  driverId: {
    type: String,
    required: false
  },
  seatsAvailable: {
    type: Number,
    required: true,
    default: 0
  },
  seatsRequested: {
    type: Number,
    required: true,
    default: 1
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
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