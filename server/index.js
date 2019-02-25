const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const fetch = require("node-fetch");
var cors = require('cors')


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use(cors())

const baseUrl = "https://api.darksky.net/forecast/bc745d8297caf2337149178bea973055/"

app.get('/api/getPastDay', (req, res) => {
  /**
   * Get the data from darsky API
   */
  var d = new Date()
  d.setDate(d.getDate() - req.query.day)
  var timestamp = Math.round(d.getTime() / 1000)
  
  let url = baseUrl + req.query.lat + "," + req.query.long + "," + timestamp + "?units=si"
  fetch(url)
  .then(function(response) {
    return response.json()
  })
  .then(function(data) {
    /**
     * Return the response to client
     */
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(data))
  })
  
});


app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);