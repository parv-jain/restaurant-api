const apiRoutes = require('./api-routes');
module.exports = function(app, db) {
  apiRoutes(app, db);
};

