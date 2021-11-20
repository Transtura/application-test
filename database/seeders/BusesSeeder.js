const Kernel = require("../../bootstrap/kernel");
const Helpers = require("../../utils/Helpers");
const UserModel = require("../../app/models/User");
const BusModel = require("../../app/models/Bus");

/* Load The Database Handler */
Kernel.application();

const Buses = [
  {
    serialNo: Helpers.randomStringGenerator(),
    seats: 5,
    driverId: '6198dd5e00d6246d51c41947',
    plateNo: Helpers.randomStringGenerator(5),
    statusId: '6198cbf0c84b1e3d4a63082d',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    serialNo: Helpers.randomStringGenerator(),
    seats: 5,
    driverId: '6198dd5e00d6246d51c41947',
    plateNo: Helpers.randomStringGenerator(5),
    statusId: '6198cbf0c84b1e3d4a63082d',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    serialNo: Helpers.randomStringGenerator(),
    seats: 5,
    driverId: '6198dd5e00d6246d51c41947',
    plateNo: Helpers.randomStringGenerator(5),
    statusId: '6198cbf0c84b1e3d4a63082d',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    serialNo: Helpers.randomStringGenerator(),
    seats: 5,
    driverId: '6198dd5e00d6246d51c41947',
    plateNo: Helpers.randomStringGenerator(5),
    statusId: '6198cbf0c84b1e3d4a63082d',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    serialNo: Helpers.randomStringGenerator(),
    seats: 5,
    driverId: '6198dd5e00d6246d51c41947',
    plateNo: Helpers.randomStringGenerator(5),
    statusId: '6198cbf0c84b1e3d4a63082d',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

/* Save The Buses To The DB */
Buses.forEach((bus) => {
  const Bus = new BusModel(bus);
  Bus.save()
    .then((data) => {
      console.log("Buses Migrated Successfully!");
    })
    .catch((e) => {
      console.log(e);
    });
});
