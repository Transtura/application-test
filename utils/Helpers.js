const StatusModel = require('../app/models/Status');
const UserModel = require('../app/models/User');
class Helpers {
  async fetchStatusId(statusName = 'Active') {
    try {
      const Status = await StatusModel.findOne({ name: statusName })
        .lean();
        
      return Status._id.toString();
    } catch (err) { return null; }
  }

  async fetchStatusName(statusId) {
    try {
      const Status = await StatusModel.findById(statusId)
        .lean();

      return Status.name;
    } catch (err) { return null; }
  }

  async findUserByEmail(email = '') {
    try {
      const User = await UserModel.findOne({ email: email })
        .lean();
      
      return User;
    } catch (err) { return null; }
  }

  async findUserByPhone(phoneNumber = '') {
    try {
      const User = await UserModel.findOne({ phoneNumber: phoneNumber })
        .lean();
      
      return User;
    } catch (err) { return null; }
  }
}

module.exports = new Helpers();