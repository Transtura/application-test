const Jwt = require("jsonwebtoken");

const UserModel = require("../app/models/User");

class JwtMiddleware {
  async verify(req, res, next) {
    if (!req.headers["authorization"]) {
      const Response = {
        message: "Bearer token required",
        errors: {
          token: "Invalid Auth Headers Passed",
        },
      };
      res.status(401).json(Response);
      res.end();
      return;
    }

    let headers = req.headers["authorization"];

    /* Verify The Headers Is A Bearer Auth */
    if (!headers.includes("Bearer ")) {
      const Response = {
        message: "Auth Headers Should Be Bearer Token",
        errors: {
          token: "Invalid Auth Headers Passed",
        },
      };
      res.status(401).json(Response);
      res.end();
      return;
    }

    /* Extract The Token From The Headers */
    headers = headers.split("Bearer ")[1];

    // Verify The Jwt Token...
    Jwt.verify(headers, req.authConfig.appKey, async function (err, decoded) {
      if (err) {
        const Response = {
          message: err.message,
          errors: {
            token: "You do not have enough access rights.",
          },
        };
        res.status(401).json(Response);
        res.end();
        return;
      } else {
        // Process The Request..
        if (decoded.data) {
          const User = await UserModel.findById(decoded.data._id);
          if (User.accountType == 'user') {
            req.rider = User;
            return next();
          } else {
            req.driver = User;
            return next();
          }
        }

        // Prepare The Error Message...
        const Response = {
          message: "Authentication Failed!",
          errors: {
            token: "You do not have enough access rights.",
          },
        };
        res.status(401).json(Response);
        res.end();
        return;
      }
    });
  }
}

module.exports = new JwtMiddleware();
