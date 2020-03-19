'use strict';


require('dotenv').config();


const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/location', (request, response) => {
  let city = request.query.city;
  console.log('city Info', city)
  let geo = require('./data/geo.json');
  let location = new Location(city, geo[0])
  console.log(location)
  response.send(location);
});

//bringing in the obj from the api/data files and the city from the user

function Location(city, obj) {
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

//response needed to send to front-end
// {
//     "search_query": "seattle",
//     "formatted_query": "Seattle, WA, USA",
//     "latitude": "47.606210",
//     "longitude": "-122.332071"
//   }
// app.get('*', (request, response) => response.send('Sorry, that route does not exist.'));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));