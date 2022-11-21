const { Console } = require('console');
let fs = require('fs');
let natural = require('natural');
let tokenizer = new natural.WordTokenizer();
let textData = new Array();
let tokenizedTexts = new Array();
let maxTokenLength = 0;
let countOfTokensPerLength = new Array();

loadTexts();
tokenizeTexts();
determineMaxTokenLength();
resetCountOfTokensPerLength();
processTokensAndUpdateCountOfTokens();
writeCountOfTokensPerLengthToConsole();

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

function tokenizeTexts() {
    textData.forEach(function(text) {
        tokens = tokenizer.tokenize(text);
        tokens.forEach(function(token) {
            tokenizedTexts.push(token);
         });
    });
}

function determineMaxTokenLength() {
    tokenizedTexts.forEach(function(token) {
        maxTokenLength = Math.max(maxTokenLength, token.length);
    });
}

function resetCountOfTokensPerLength() {
    for (i = 0; i < maxTokenLength + 1; i++)
        countOfTokensPerLength.push(0);
}

function processTokensAndUpdateCountOfTokens() {
    tokenizedTexts.forEach(function(token) {
        let tokenLength = token.length;

        // Update the count of tokens that have the same length
        countOfTokensPerLength[tokenLength]++;
    });
}

function writeCountOfTokensPerLengthToConsole() {
    console.log("Length of Tokens,Count of Tokens");
    for (i = 1; i < countOfTokensPerLength.length; i++)
        console.log(i + "," + countOfTokensPerLength[i]);
}