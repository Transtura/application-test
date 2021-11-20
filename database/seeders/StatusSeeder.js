const Kernel = require('../../bootstrap/kernel');
const StatusModel = require('../../app/models/Status');

/* Load The Database Handler */
Kernel.application();

const Statuses = [
  { name: 'Active', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Pending', createdAt: new Date(), updatedAt: new Date() },
  { name: 'In Progress', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Completed', createdAt: new Date(), updatedAt: new Date() }
]

/* Migrate Each Of The Statuses. */
Statuses.forEach((status) => {
  let statusModel = new StatusModel(status);
  statusModel.save()
    .then(() => { 'Operation Successful' })
    .catch((e) => { console.log(e) });
  
  return;
});