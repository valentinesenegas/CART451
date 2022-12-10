//***************************************************************//
//                         Server side                           //
//***************************************************************//

const express = require("express");
const portNumber = 4200;
const app = express(); // make an instance of express
const server = require("http").createServer(app);
require("dotenv").config();
const mongoose = require("mongoose");
const processLyrics = require("./lyrics-processing.js");

let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


const url = process.env.MONGODB_URI;
console.log(url);
const lyrics_collection_model = require("./DBSchema.js");
let artists_words_collection = [];

// Connect to the database
mongoose.connect(url);
let db = mongoose.connection;
db.once("open", async function(){

  console.log("db is connected");

  lyrics_collection_model.find({ }, function (err, results) {
    if (err) return handleError(err);
    results.forEach(function (value, index, array) {

      /* Process the lyrics associated with this artist. */
      let wordsAndFrequencies = processLyrics(value.lyrics);

      let wordsAndFrequenciesObj = [];
      wordsAndFrequencies.forEach(function (value, index, array) {
        wordsAndFrequenciesObj.push({"word": value.word, "frequency": value.frequency, "sentiment": value.sentiment});
      });

      artist_words = { "artist" : value.artist, "wordsAndFrequencies": wordsAndFrequenciesObj};
      artists_words_collection.push(artist_words);
    });
  })
})

// make server listen for incoming messages
server.listen(portNumber, function () {
  console.log("listening on port:: " + portNumber);
});

// create a server (using the Express framework object)
app.use(express.static(__dirname + "/public"));
app.use("/client", clientRoute);

//default route
app.get("/", function (req, res) {
  res.send("<h1>Hello world, this is a new project!</h1>");
});

function clientRoute(req, res, next) {
  res.sendFile(__dirname + "/client.html");
}

// Defining get request at '/data' route
app.get('/data', function(req, res) {
  console.log("request /data received");
  res.json(artists_words_collection);

});