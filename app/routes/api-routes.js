var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

  //fetch particular restaurant complete details by its id
  app.get('/restaurants/:id', (req, res) => {
    var id = req.params.id;
    var query = { '_id': new ObjectID(id) };
    db.collection('restaurant_data').findOne(query, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        query = { 'restaurant_id': item.restaurant_id };
        db.collection('restaurant_location').findOne(query, (err, location) => {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            item.location = location;
            res.send(item);
          }
        })
      }
    });
  });

  //fetch paginated wise restaurants data
  app.get('/restaurants/page/:page/size/:size', (req, res) => {
    var page = parseInt(req.params.page);
    var size = parseInt(req.params.size);
    db.collection('restaurant_data').find().skip(size * (page - 1)).limit(size).toArray(function(err, items) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
	      res.send(items);
      }
    });
  });

  //sort by column order
  app.get('/restaurants/sort/by/:by/order/:order', (req, res) => {
    var by = req.params.by;
    var order = parseInt(req.params.order);
    sortBy = {};
    sortBy[by] = order;
    db.collection('restaurant_data').find().sort(sortBy).toArray(function(err, items) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
	      res.send(items);
      }
    });
  });

  //Search by restaurant name
  app.get('/restaurants/search/name/:query', (req, res) => {
    var query = req.params.query;
    db.collection('restaurant_data').find({restaurant_name: {"$regex": query, "$options": "i"}}).toArray(function(err, items) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
	      res.send(items);
      }
    });
  });
};
