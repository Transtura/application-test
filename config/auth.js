const Moment = require('moment');

/**
 * @author Ilori Stephen A <stephenilori458@gmail.com>
 * @description This file returns the auth base configurations.
 * @param {null}
 * @name AuthConfig
 * @returns {Object}
 * 
 */

module.exports = {
  'guards': [
    {
      web: {
        driver: 'Session',
        provider: 'Users'
      },
      api: {
        driver: 'Jwt',
        providers: 'Users'
      }
    }
  ],
  password_timeout: Moment().add(5, 'minutes')
};