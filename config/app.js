require('dotenv').config();

/**
 * @author Ilori Stephen A <stephenilori458@gmail.com>
 * @description This file returns the app base configurations.
 * @param {null}
 * @name ApplicationConfig
 * @returns {Object}
 * 
 */
module.exports = {
  appKey: process.env.APP_KEY,
  appUrl: process.env.APP_URL,
  appPort: process.env.APP_PORT,
  appName: process.env.APP_NAME,
  appTimezone: process.env.APP_TIMEZONE,
  appEnvironment: process.env.APP_ENV,
}