/**
 * @author Ilori Stephen A <stephenilori458@gmail.com>
 * @description This file loads in all of the route required by the application.
 * @param {Object}
 * @name APIRoutes
 * @alias Routes
 * @returns {Function}
 * 
 */

const AuthController = require('../app/controllers/API/AuthController');

const Routes = (Route) => {
  Route.post('/api/v1/inspire', (req, res, next) => {
    return res.status(201).json({ message: 'Hello World!' });
  });

  /* Auth Routes */
  Route.post('/api/v1/register', AuthController.register);
  Route.post('/api/v1/login', AuthController.login);
}

module.exports = Routes;