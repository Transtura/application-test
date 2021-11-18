/**
 * @author Ilori Stephen A <stephenilori458@gmail.com>
 * @description The entry point into the application
 * @param {null}
 * @name Index
 * @returns {Null}
 *
 */

const Kernel = require('./bootstrap/kernel');

/* Run The Application */
const Transtura = Kernel.application();

Transtura.app.listen(Transtura.appPort, () => {
  console.log(Transtura.appName + ' is running on ' + Transtura.appUrl);
});