'use strict';


require('dotenv').config();


const express = require('express');
const app = express();
const cors = require('cors');

//Iris helped with this part
const superAgent = require('superagent'); 

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


// get the data from (file | API) and send it the front end

app.get('/location',(request, response) => {
  let city = request.query.city;
  if ((city === '') || (city === null))
    throw 'Not a valid city';
  console.log('You requested on city: ', city);
  // console.log('geoKey: ', process.env.GEOCODE_API_KEY);
  // create url from where we are getting the data using superagent API
  let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`;
  superAgent.get(url)
    .then(superAgentResults =>{
      console.log(superAgentResults.body[0]);
      let location = new Location(superAgentResults.body[0]);
      response.send(location);
    })
    .catch(err => console.log(err));
});

//bringing in the obj from the api/data files and the city from the user

function Location(city, obj) {
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}


//Weather Stuff
app.get('/weather',(request, response) => {

  // obtaining the info from darkSkyAPI using superagent
  let url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.latitude},${request.query.longitude}`;
  // console.log(url);
  superAgent.get(url)
    .then(superAgentResults =>{
      console.log(superAgentResults.body.daily.data);
      let arrAllweather = superAgentResults.body.daily.data.map(weatherElement =>{
        return (new Weather(weatherElement));
      });
      response.send(arrAllweather); // here is where we have to send an araray of objects
    })
    .catch(err => console.log(err));

    //Matches weather above
    function Weather(obj){
      this.time = new Date(obj.time * 1000).toString().slice(0, 15);
      this.forecast = obj.summary;
    }
})

    //Trail Stuff
    app.get('/trails',(request, response) => {
      console.log('now in Trails');
      let url =`https://www.hikingproject.com/data/get-trails?lat=${request.query.latitude}&lon=${request.query.longitude}&maxDistance=10&key=${process.env.TRAIL_API_KEY}`;
      console.log('URL', url);
      superAgent.get(url)
        .then(superAgentResults => {
          console.log(superAgentResults.body.trails[0].name);
          let arrAllTrails = superAgentResults.body.trails.map(trail => new Trail(trail));
          response.send(arrAllTrails);
        })
        .catch(err => console.log(err));
    })

    //mathes trail above
    function Trail(obj){
      this.name = obj.name;
      this.location = obj.location;
      this.length = obj.length;
      this.stars = obj.stars;
      this.star_votes = obj.starVotes;
      this.summary = obj.summary;
      this.trail_url = obj.url;
      this.conditions = obj.conditionStatus;
      this.condition_date = new Date(obj.conditionDate).toString().slice(0, 15);
      this.condition_time = new Date(obj.conditionDate).toString().slice(16,25);
    }

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));