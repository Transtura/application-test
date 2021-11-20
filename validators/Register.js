const Base = require('./Base');

const Helpers = require('../utils/Helpers');

class Register extends Base {
  constructor() {
    super();
    this.Response
    this.Response = { status: false, errors: {} };
  }

  async register(Payload) {
    try {
      if (Payload.firstName && !super.validateString(Payload.firstName)) {
        this.Response.status = true;
        this.Response.errors.firstName = 'Sorry, Only Alphabets are allowed!';
      }

      if (Payload.lastName && !super.validateString(Payload.lastName)) {
        this.Response.status = true;
        this.Response.errors.lastName = 'Sorry, Only Alphabets are allowed!';
      }

      if (Payload.email && !super.validateEmail(Payload.email)) {
        this.Response.status = true;
        this.Response.errors.email = 'Please, check the email address and try again!';
      }

      if (Payload.password && Payload.password.length < 8) {
        this.Response.status = true;
        this.Response.errors.password = 'Please, the minimum allowed password characters is 8';
      }

      /* Check The Email && Phone Is Unique */
      const [ Email, Phone ] = await Promise.all([Helpers.findUserByEmail(Payload.email), Helpers.findUserByPhone(Payload.phone)]);
      if (Email) {
        this.Response.status = true;
        this.Response.errors.email = 'Sorry, The selected email address is unavailable!';
      }

      if (Phone) {
        this.Response.status = true;
        this.Response.errors.phone = 'Sorry, The selected phone number is unavailable!';
      }

      if (!['user', 'driver'].includes(Payload.accountType)) {
        this.Response.status = true;
        this.Response.errors.accountType = 'Sorry, The account type should either be User or Driver'
      }

      return this.Response;
    } catch (err) {
      this.Response.status = true,
      this.Response.errors = { keys: 'Sorry, Please, check your request body and try again!' };

      /* Send Back The Error Response */
      return this.Response;
    }
  }

  async login(Payload, Model) {
    try {
      const StatusId = await Helpers.fetchStatusId('Active');
      const User = await Model.findOne({ email: Payload.email, status_id: StatusId })
        .lean();

      /* Check The Model */
      if (!User) {
        this.Response.status = true;
        this.Response.errors.user = 'Sorry, Your account seems inactive! Please, contact admin!';
      }

      return this.Response;
    } catch (err) {
      this.Response.status = true,
      this.Response.errors = { keys: 'Sorry, Please, check your request body and try again!' };

      /* Send Back The Error Response */
      return this.Response;
    }
  }
}

module.exports = new Register();