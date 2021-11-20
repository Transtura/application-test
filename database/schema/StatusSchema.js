const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

module.exports = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
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