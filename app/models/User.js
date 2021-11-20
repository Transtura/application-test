const Mongoose = require('mongoose');
const Schema = require('../../database/schema/UserSchema');

class User {
  user() {
    const UserModel = Mongoose.model.Users || Mongoose.model('Users', Schema);
    return UserModel;
  }
}

module.exports = new User().user();