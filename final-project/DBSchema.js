const mongoose = require("mongoose");
const lyrics_collection_Schema = new mongoose.Schema({
    artist: String,
    lyrics: String
})

//3rd parameter: name of collection on MongoDB
const lyricsCollectionModel = mongoose.model("LyricsModel", lyrics_collection_Schema, "lyrics_collection");
module.exports = lyricsCollectionModel;