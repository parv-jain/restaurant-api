var parse = require('csv-parser');
var fs = require('fs')
var path = require('path');

var filePath = path.join(__dirname, 'restaurant_addc9a1430.csv');

var data = [];
module.exports = function(app, db) {
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
      db.collection('restaurant_location').insert(location);
    }
  });
};