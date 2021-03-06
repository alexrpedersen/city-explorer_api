//Alex helped out and walked me through this

'use strict';
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const PORT = process.env.PORT || 3001;



const client = require('./lib/client');
const getLocation = require('./lib/getLocation');
//const getMovies = require('./lib/getMovies');
const getTrails= require('./lib/getTrails');
const getWeather= require('./lib/getWeather');




client.connect()
  .then (() => {
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
  });

client.on('error', err => console.log(err));

app.get('/location',getLocation);
app.get('/weather', getWeather);
app.get('/trails', getTrails);
//app.get('/movies', getMovies);




app.get('*',(request,response)=>{
  response.status(500).send('there is nothing on this page');
})

