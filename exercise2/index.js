const { Console } = require('console');
let fs = require('fs');
let natural = require('natural');
var NGrams = natural.NGrams;
let tokenizer = new natural.WordTokenizer();
let textData = new Array();
let tokenizedTexts = new Array();
let maxTokenLength = 0;
let countOfTokensPerLength = new Array();


loadTexts();    // Load the texts that will be used for tokens, bigrams and trigrams.
processTokensOrNGrams(1, "tokens.csv"); // Single tokens.
processTokensOrNGrams(2, "bigrams.csv"); // Bigrams.
processTokensOrNGrams(3, "trigrams.csv"); // Trigrams.

// Main function that separate the whole tasks in smaller tasks.
function processTokensOrNGrams(n, resultFilename) {
    tokenizeTexts(n);
    determineMaxTokenLength();
    resetCountOfTokensPerLength();
    updateCountOfTokens();
    writeCountOfTokensPerLengthToFile(resultFilename);
}

// Functions for the program
function loadTexts() {
    let filenames = ['thecouncilheldbytherats.txt',
                    'thedogandcat.txt', 
                    'theflyandthegame.txt', 
                    'thefrogthatwishedtobeasbigastheox.txt',
                    'thegrasshopperandtheant.txt', 
                    'theravenandthefox.txt',   
                    'thetwobullsandthefrog.txt', 
                    'thewolfaccusingthefoxbeforethemonkey.txt'];
  
    filenames.forEach(function(filename) {
        textData.push(fs.readFileSync('files/' + filename, 'utf8'));
    });
}

function tokenizeTexts(n) {
    // Reset variables.
    tokenizedTexts = new Array();
    maxTokenLength = 0;

    let countOfTokensPerLength = new Array();
    textData.forEach(function(text) {
        // Case for single token.
        if (n == 1) {
            tokens = tokenizer.tokenize(text);
            tokens.forEach(function(token) {
                tokenizedTexts.push(token);
             });
    
        }

        // Case for N-grams.
        else {
            let ngrams;
            if (n == 2)
                ngrams = NGrams.bigrams(text);
            else if (n == 3)
                ngrams = NGrams.trigrams(text);
            else
                ngrams = NGrams.ngrams(text, n);
            ngrams.forEach(function(ngram) {
                let string_for_ngrams = "";
                ngram.forEach(function(token) {
                    string_for_ngrams += token + " ";
                });
                string_for_ngrams.slice(0, -1);     // Remove the last character which is always " ".
                tokenizedTexts.push(string_for_ngrams);
            });
        }
    });
}

function determineMaxTokenLength() {
    tokenizedTexts.forEach(function(token) {
        maxTokenLength = Math.max(maxTokenLength, token.length);
    });
}

function resetCountOfTokensPerLength() {
    countOfTokensPerLength = new Array();
    for (i = 0; i < maxTokenLength + 1; i++)
        countOfTokensPerLength.push(0);
}

function updateCountOfTokens() {
    tokenizedTexts.forEach(function(token) {
        let tokenLength = token.length;

        // Update the count of tokens that have the same length
        countOfTokensPerLength[tokenLength]++;
    });
}

function writeCountOfTokensPerLengthToFile(resultFilename) {
    let content;

    // Header.
    content = "Length of Tokens,Count of Tokens\n";

    // Write data.
    for (i = 1; i < countOfTokensPerLength.length; i++)
        content += i + "," + countOfTokensPerLength[i] + "\n";

    fs.writeFile(resultFilename, content, err => {
        if (err) {
            console.error(err);
        }
    });


}