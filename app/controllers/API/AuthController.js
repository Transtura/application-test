const Controller = require("../Controller");

/* Import Helpers */
const Helpers = require("../../../utils/Helpers");

/* Validator Imports */
const RegisterValidator = require("../../../validators/Register");

/* NodeJs Imports */
const Jwt = require('jsonwebtoken');
const Crypto = require("crypto-js");

/* Model Imports */
const UserModel = require("../../models/User");

class AuthController extends Controller {
  constructor() {
    super();
  }

  async register(req, res, next) {
    try {
      const Body = req.body;
      const Validator = await RegisterValidator.register(Body);

      /* Check The Validator Status */
      if (Validator.status) {
        return super.sendErrorResponse(
          res,
          Validator.errors,
          "Registration failed!",
          400
        );
      }

      /* Create The Payload*/
      let statusId = await Helpers.fetchStatusId("Active");
      const Payload = {
        ...Body,
        statusId,
        password: Crypto.AES.encrypt(
          Body.password,
          req.authConfig.appKey
        ).toString(),
      };

      /* Create The User */
      let newUser = new UserModel(Payload);
      newUser = await newUser.save();

      return super.sendSuccessResponse(
        res,
        {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          accountType: newUser.accountType,
          phone: Body.phone,
          status_id: statusId,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
        "Account Created Successfully!",
        201
      );
    } catch (err) {
      console.log(err);
      return super.sendServerError(
        res,
        "Sorry, something went wrong! Please, try again"
      );
    }
  }

  async login(req, res, next) {
    try {
      const Body = req.body;
      const Validator = await RegisterValidator.login(Body, UserModel);

      /* Check the validator status */
      if (Validator.status) {
        return super.sendErrorResponse(
          res,
          Validator.errors,
          "Login Failed",
          400
        );
      }

      /* Compare The User Password && Generate The JWT Token */
      const statusId = await Helpers.fetchStatusId("Active");
      const User = await UserModel.findOne({
        email: Body.email,
        statusId,
      }).lean();

      /* Compare The User Password */
      const HashedPassword = Crypto.AES.decrypt(
        User.password,
        req.authConfig.appKey
      ).toString(Crypto.enc.Utf8);

      if (HashedPassword !== Body.password) {
        return super.sendErrorResponse(
          res,
          { email: "Email/Password Mismatch! Please, try again" },
          "Login Failed!",
          400
        );
      }

      /* Generate JWT Token */
      const JwtToken = Jwt.sign(
        {
          data: {
            _id: User._id.toString(),
          },
        },
        req.authConfig.appKey,
        { expiresIn: "1day" }
      );

      /* Send Back The Response Object */
      return super.sendSuccessResponse(
        res,
        {
          user: {...User, password: null },
          accessToken: JwtToken,
        },
        "Login Successful!",
        200
      );
    } catch (err) {
      console.log(err);
      return super.sendServerError(
        res,
        "Sorry, something went wrong! Please, try again"
      );
    }
  }
}

module.exports = new AuthController();
