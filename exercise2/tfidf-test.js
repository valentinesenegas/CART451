const natural = require("natural");
const { removeStopwords } = require("stopword");
const NUMBER_OF_MOST_FREQUENT_WORDS = 20;

var TfIdf = natural.TfIdf;

const processText = function(text) {
    var wordsAndFrequencies = new Array();
    var tfidf = new TfIdf();
    var tokenizer = new natural.WordTokenizer();
    var tokenizedText = tokenizer.tokenize(text);
    var tokenizedTextWithoutStopwords = removeStopwords(tokenizedText);

    // Remove words with only 1 or 2 letters. 
    // Lowercase all words.
    for (let i = 0; i < tokenizedTextWithoutStopwords.length; i++) {
        tokenizedTextWithoutStopwords[i] = tokenizedTextWithoutStopwords[i].toLowerCase();
        if (tokenizedTextWithoutStopwords[i].length < 3)
            tokenizedTextWithoutStopwords[i] = "";

        // Remove "don" which comes from "don't"
        var s = tokenizedTextWithoutStopwords[i];
        if (s == 'don' || s =='let' || s =='will' || s =='not' || s =='dont'|| s =='yeah' || s =='off' || s =='thats' || s =='not' || s =='its' || s =='when'|| s =='she' || s =='ain' || s =='aint' || s =='ooh')
            tokenizedTextWithoutStopwords[i] = "";
    }

    tfidf.addDocument(tokenizedTextWithoutStopwords);
    tfidf.listTerms(0).forEach(function(item) {
        //console.log("Term-> " + item.term + ': ' + item.tfidf);
        wordsAndFrequencies.push({ word:item.term, frequency:item.tfidf});
    });


    wordsAndFrequencies.sort((r1, r2) => (r1.frequency > r2.frequency) ? -1 : (r1.frequency < r2.frequency) ? 1 : 0);
    wordsAndFrequencies = wordsAndFrequencies.slice(0, NUMBER_OF_MOST_FREQUENT_WORDS);
    return wordsAndFrequencies;
}

var wordsAndFrequencies = processLyrics(value.lyrics);
wordsAndFrequencies.forEach(function (value, index, array) {
  console.log("#" + (index + 1) + " Word:" + value.word + " Frequency:" + value.frequency);
});