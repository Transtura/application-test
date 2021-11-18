/**
 * @author Ilori Stephen A <stephenilori458@gmail.com>
 * @description This file loads in all the Config file configuration.
 * @param {null}
 * @name CorsConfig
 * @returns {Object}
 *
 */

/* Config Based Configurations */
const AppConfig = require("../config/app");
const AuthConfig = require("../config/auth");
const CorsConfig = require("../config/cors");
const MailConfig = require("../config/mail");
const DatabaseConfig = require("../config/database");

/* NPM Based Imports */
const Cors = require("cors");
const Morgan = require("morgan");
const Helmet = require("helmet");
const Express = require("express");
const BodyParser = require("body-parser");
const Nodemailer = require("nodemailer");

/* Load In Routes */
const ApiRoutes = require('../routes/api');

class Kernel {
  static #express() {
    try {
      const App = new Express();

      /* Set The Global TimeZone */
      process.env.TZ = AppConfig.appTimezone;

      /* Hook In The Application Middlewares */
      App.use(Helmet());
      App.use(Cors(CorsConfig));
      App.set("trust proxy", 1);
      App.use(BodyParser.json());
      App.use(Morgan("combined"));
      App.use('*', (req, res, next) => {
        req.authConfig = AuthConfig;
        next();
      });
      App.use(Express.static("public"));
      App.use(BodyParser.urlencoded({ extended: false }));

      return App;
    } catch (err) {
      throw new Error(`Express Framework Failed To Initialize: ${err.name}`);
    }
  }

  static #database() {
    const DbType = DatabaseConfig.default;

    if (DbType == "MongoDB") {
      const Mongoose = require("mongoose");

      /* Init Mongoose Connections */
      Mongoose.promise = global.Promise;
      Mongoose.connect(
        DatabaseConfig.connections.MongoDB.url,
        DatabaseConfig.connections.MongoDB.options
      );
    }
  }

  static mail() {
    try {
      const mailService = MailConfig.mailService;

      if (mailService == 'smtp') {
        const Transporter = Nodemailer.createTransport({
          host: MailConfig.smtp.mailHost,
          port: MailConfig.smtp.mailPort,
          secureConnection: true,
          auth: MailConfig.smtp.auth
        });

        return Transporter;
      } else if (mailService == 'sendInBlue') {
        const Transporter = Nodemailer.createTransport({
          service: 'sendinblue',
          auth: MailConfig.sendInBlue
        });

        return Transporter;
      }

      /* Attach Extra Mail Service As Required */
    } catch (err) {
      throw new Error(`Express Framework Failed To Initialize: ${err.name}`);
    }
  }

  application() {
    const App = Kernel.#express();

    /* Load In The Database */
    Kernel.#database();

    /* Attach The Application Routes */
    ApiRoutes(App);

    return {
      app: App,
      appUrl: AppConfig.appUrl,
      appName: AppConfig.appName,
      appPort: AppConfig.appPort,
    }
  }
}

module.exports = new Kernel();
