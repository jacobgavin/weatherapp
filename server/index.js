const express = require('express');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");
var cors = require('cors')

require('dotenv').config()


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

/**
 * Api documentation https://open-meteo.com/en/docs/historical-weather-api
 */
const baseUrl = 'https://archive-api.open-meteo.com/v1/archive';

const cache = {}
app.get('/api/getPastDay', (req, res) => {
  var now = new Date();
  
  var y = new Date();
  y.setDate(now.getDate() - 2)

  var p = new Date()
  p.setDate(now.getDate() - parseInt(req.query.day) - 1)
  
  const url = baseUrl + '?latitude='+req.query.lat+'&longitude='+req.query.long+'&hourly=temperature_2m&start_date='+formatDate(p)+'&end_date='+formatDate(y);

  if (cache[url]) {
    console.log('Hit cache')
    res.setHeader('Content-Type', 'application/json')
    return res.send(JSON.stringify(cache[url]))
  }

  fetch(url)
    .then(function(response) {
      return response.json()
    })
    .then(function(data) {
      cache[url] = data;

      /**
       * Return the response to client
       */
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(data))
    }).catch(function(error) {
      console.log(error)
    })
  
});

function formatDate(date) {
  return date.toISOString().split('T')[0]
}


app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);