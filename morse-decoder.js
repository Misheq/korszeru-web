var table = require("./morse-code-table.js");

exports.splitIntoMorseWords = function(morseInputString) {
    return morseInputString.split("   ");
}

exports.splitIntoMorseCharacters = function(morseWord) {
    return morseWord.split(" ");
}

exports.decodeMorseCharacter = function(morseCharacter) {
    return table[morseCharacter];
}

exports.decodeMessage = function(morseInputString) {

    var morseWords = this.splitIntoMorseWords(morseInputString.trim());
    var message = "";

    for (var i = 0; i < morseWords.length; i++) {
        var morseCharacters = this.splitIntoMorseCharacters(morseWords[i]);

        for (var j = 0; j < morseCharacters.length; j++) {
            if (morseCharacters[j] in table) {
                message += this.decodeMorseCharacter(morseCharacters[j]);
            }
        }

        message += " ";
    }
    return message.trim();
}