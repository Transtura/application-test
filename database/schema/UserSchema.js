const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

module.exports = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  statusId: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    enum: ['user', 'driver'],
    required: true
  },
  password: {
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
})