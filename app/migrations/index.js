const migration1 = require('./restaurant-data-migration');
const migration2 = require('./restaurant-location-migration');
module.exports = function(app, db) {
  migration1(app, db);
  migration2(app, db);
  console.log("Migrations called.");
};

