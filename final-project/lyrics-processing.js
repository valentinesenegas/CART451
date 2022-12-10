const natural = require("natural");
const { removeStopwords } = require("stopword");
const NUMBER_OF_MOST_FREQUENT_WORDS = 20;
const sentimentAnalysis = require('sentiment-analysis');

let TfIdf = natural.TfIdf;

const processLyrics = function(lyrics) {
    let wordsAndFrequencies = new Array();
    let tfidf = new TfIdf();
    let tokenizer = new natural.WordTokenizer();
    let tokenizedLyrics = tokenizer.tokenize(lyrics);
    let tokenizedLyricsWithoutStopwords = removeStopwords(tokenizedLyrics);

    // Remove words with only 1 or 2 letters. 
    // Lowercase all words.
    for (let i = 0; i < tokenizedLyricsWithoutStopwords.length; i++) {
        tokenizedLyricsWithoutStopwords[i] = tokenizedLyricsWithoutStopwords[i].toLowerCase();
        if (tokenizedLyricsWithoutStopwords[i].length < 3)
            tokenizedLyricsWithoutStopwords[i] = "";

        // Remove "don" which comes from "don't"
        let s = tokenizedLyricsWithoutStopwords[i];
        if (s == 'don' || s =='let' || s =='will' || s =='not' || s =='dont'|| s =='yeah' || s =='off' || s =='thats' || s =='not' || s =='its' || s =='when'|| s =='she' || s =='ain' || s =='aint' || s =='ooh')
            tokenizedLyricsWithoutStopwords[i] = "";
    }

    tfidf.addDocument(tokenizedLyricsWithoutStopwords);
    tfidf.listTerms(0).forEach(function(item) {
        let sentimentScore = sentimentAnalysis(item.term);
        wordsAndFrequencies.push({ word:item.term, frequency:item.tfidf, sentiment:sentimentScore});
    });

    wordsAndFrequencies.sort((r1, r2) => (r1.frequency > r2.frequency) ? -1 : (r1.frequency < r2.frequency) ? 1 : 0);
    wordsAndFrequencies = wordsAndFrequencies.slice(0, NUMBER_OF_MOST_FREQUENT_WORDS);
    return wordsAndFrequencies;
}

/**
 * Module exports
 */
 module.exports = processLyrics;