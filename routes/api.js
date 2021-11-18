/**
 * @author Ilori Stephen A <stephenilori458@gmail.com>
 * @description This file loads in all of the route required by the application.
 * @param {Object}
 * @name APIRoutes
 * @alias Routes
 * @returns {Function}
 * 
 */

const Routes = (Route) => {
  Route.post('/api/v1/inspire', (req, res, next) => {
    return res.status(201).json({ message: 'Hello World!' });
  });
}

module.exports = Routes;