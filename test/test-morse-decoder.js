"use strict";

var expect = require("chai").expect;
var morseDecoder = require("../morse-decoder");

describe("Morse decoder", function () {

    describe("Split morse input into morse words", function () {
        it("should split the input sentence into two words at given delimiter", function () {
            var words = morseDecoder.splitIntoMorseWords(".- - -   .- .");
            expect(words.length).to.eql(2);
            expect(words[0]).to.eql(".- - -");
            expect(words[1]).to.eql(".- .")
        });

        it("should split the input sentence into three words at given delimiter", function () {
            var words = morseDecoder.splitIntoMorseWords(".- --   .   - -");
            expect(words.length).to.eql(3);
            expect(words[0]).to.eql(".- --");
            expect(words[1]).to.eql(".")
            expect(words[2]).to.eql("- -")
        });
    });

    describe("Split morse word into morse characters", function () {
        it("should split the input word into three characters at given delimiter", function () {
            var characters = morseDecoder.splitIntoMorseCharacters(".- -- -.--");
            expect(characters.length).to.eql(3);
            expect(characters[0]).to.eql(".-");
            expect(characters[1]).to.eql("--");
            expect(characters[2]).to.eql("-.--");
        });
    });

    describe("Decode morse character into ascii", function () {
        it("should get A if given .-", function () {
            var character = morseDecoder.decodeMorseCharacter(".-");
            expect(character).to.eql("A");
        });

        it("should get SOS if given ...---...", function () {
            var character = morseDecoder.decodeMorseCharacter("...---...");
            expect(character).to.eql("SOS");
        });
    });

    describe("Decode morse message into ascii", function () {
        it("should get TEST PASSED if given - . ... -   .--. .- ... ... . -..", function () {
            var message = morseDecoder.decodeMessage("- . ... -   .--. .- ... ... . -..");
            expect(message).to.eql("TEST PASSED");
        });

        it("should ignore spaces at beginning and at end", function () {
            var message = morseDecoder.decodeMessage("     - . ... -   .--. .- ... ... . -..    ");
            expect(message).to.eql("TEST PASSED");
        });
    });
});