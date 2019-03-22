var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

  app.get('/restaurants/:id', (req, res) => {
    var id = req.params.id;
    var query = { '_id': new ObjectID(id) };
    db.collection('restaurants_data').findOne(query, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        query = { 'restaurant_id': item.restaurant_id };
        db.collection('restaurant_locations').findOne(query, (err, location) => {
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

  app.get('/restaurants/page/:page/size/:size', (req, res) => {
    var page = parseInt(req.params.page);
    var size = parseInt(req.params.size);
    var query = {};
    query.skip = size * (page - 1)
    query.limit = size
    db.collection('restaurants_data').find({}, {}, query).toArray(function(err, items) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
	      res.send(items);
      }
    });
  });

  app.get('/push-data/csv-to-restaurant-collection/', (req, res) => {
    var parse = require('csv-parser');
    var fs = require('fs')
    var path = require('path');

    var filePath = path.join(__dirname, 'restaurantsa9126b3.csv');
    
    var data = [];
    fs.createReadStream(filePath).pipe(parse())
    .on('data', function(csvData) {
      data.push(csvData);
    })
    .on('end', () => {
      for (var index = 0; index < data.length; index++) {
        var restaurant = 
        { restaurant_id: data[index]['Restaurant ID'], 
          restaurant_name: data[index]['Restaurant Name'],
          cuisines: data[index]['Cuisines'],
          avg_cost_for_two: data[index]['Average Cost for two'],
          currency: data[index]['Currency'],
          has_table_booking: data[index]['Has Table booking'],
          has_online_delivery: data[index]['Has Online delivery'],
          aggregate_rating: data[index]['Aggregate rating'],
          rating_color: data[index]['Rating color'],
          rating_text: data[index]['Rating text'],
          votes: data[index]['Votes']
        };
        db.collection('restaurants_data').insert(restaurant, (err, result) => {
          if (err) { 

          } else {
          
          }
        });
      }
      res.send("Queued");
    })
  });

  app.get('/push-data/csv-to-location-collection/', (req, res) => {
    var parse = require('csv-parser');
    var fs = require('fs')
    var path = require('path');

    var filePath = path.join(__dirname, 'restaurant_addc9a1430.csv');
    
    var data = [];
    fs.createReadStream(filePath).pipe(parse())
    .on('data', function(csvData) {
      data.push(csvData);
    })
    .on('end', () => {
      for (var index = 0; index < data.length; index++) {
        var location = 
        { restaurant_id: data[index]['Restaurant ID'], 
          country_code: data[index]['Country Code'],
          city: data[index]['City'],
          address: data[index]['Address'],
          locality: data[index]['Locality'],
          locality_verbose: data[index]['Locality Verbose'],
          longitude: data[index]['Longitude'],
          latitude: data[index]['Latitude']
        };
        db.collection('restaurant_locations').insert(location, (err, result) => {
          if (err) { 

          } else {
          
          }
        });
      }
      res.send("Queued");
    })
  });

};
