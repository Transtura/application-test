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
const BookingController = require('../app/controllers/API/BookingController');

/* Middleware Imports */
const AuthMiddleware = require('../middleware/auth');

const Routes = (Route) => {
  Route.get('/api/v1/inspire', (req, res, next) => {
    return res.status(201).json({ message: 'Hello World!' });
  });

  /* Auth Routes */
  Route.post('/api/v1/register', AuthController.register);
  Route.post('/api/v1/login', AuthController.login);

  /* Booking Routes */
  Route.post('/api/v1/booking/search', AuthMiddleware.verify, BookingController.searchBooking);
  Route.post('/api/v1/booking', AuthMiddleware.verify, BookingController.makeBooking);
  Route.get('/api/v1/booking/:bookingId', AuthMiddleware.verify, BookingController.confirmBooking);
  Route.get('/api/v1/booking/start/:bookingId', AuthMiddleware.verify, BookingController.startBooking);
  Route.get('/api/v1/booking/complete/:bookingId', AuthMiddleware.verify, BookingController.completeBooking);
  Route.delete('/api/v1/booking/:bookingId', AuthMiddleware.verify, BookingController.cancelBooking);
}

module.exports = Routes;