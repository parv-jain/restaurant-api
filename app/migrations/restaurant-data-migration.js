var parse = require('csv-parser');
var fs = require('fs')
var path = require('path');

var filePath = path.join(__dirname, 'restaurantsa9126b3.csv');

var data = [];
module.exports = function(app, db) {
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
        avg_cost_for_two: parseFloat(data[index]['Average Cost for two']),
        currency: data[index]['Currency'],
        has_table_booking: data[index]['Has Table booking'],
        has_online_delivery: data[index]['Has Online delivery'],
        aggregate_rating: parseFloat(data[index]['Aggregate rating']),
        rating_color: data[index]['Rating color'],
        rating_text: data[index]['Rating text'],
        votes: parseInt(data[index]['Votes'])
      };
      db.collection('restaurant_data').insert(restaurant);
    }
  });
};