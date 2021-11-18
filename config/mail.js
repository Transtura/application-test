/**
 * @author Ilori Stephen A <stephenilori458@gmail.com>
 * @description This file returns the mail base core configuration.
 * @param {null}
 * @name MAILConfig
 * @returns {Object}
 *
 */

module.exports = {
  mailService: 'smtp',

  smtp: {
    mailHost: process.env.MAIL_HOST,
    mailPort: process.env.MAIL_PORT,
    secureConnection: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  },
  sendInBlue: {
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  }
}