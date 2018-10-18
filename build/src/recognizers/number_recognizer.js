"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const words_to_numbers_1 = require("words-to-numbers");
const tokenizer_1 = require("../tokenizer");
const utilities_1 = require("../utilities");
const quantity_recognizer_1 = require("./quantity_recognizer");
class NumberRecognizer {
    constructor() {
        this.lexicon = new Set([
            'zero', 'one', 'two', 'three', 'four', 'five',
            'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
            'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
            'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty',
            'sixty', 'seventy', 'eighty', 'ninety', 'hundred', 'thousand',
            'million', 'trillion'
        ]);
        this.apply = (token) => {
            const text = token.text;
            const terms = text.split(' ');
            return this.parseSequence(new utilities_1.PeekableSequence(terms[Symbol.iterator]()));
        };
        this.terms = () => {
            return this.lexicon;
        };
        this.stemmer = (word) => {
            // DESIGN NOTE: NumberRecognizer does not stem.
            return word;
        };
    }
    parseNumberSequence(sequence) {
        const terms = [];
        while (!sequence.atEOF()) {
            if (this.lexicon.has(sequence.peek())) {
                terms.push(sequence.get());
            }
            else {
                break;
            }
        }
        if (terms.length === 0) {
            throw TypeError('parseNumberSequence: expected a number.');
        }
        const text = terms.join(' ');
        const value = words_to_numbers_1.default(text);
        if (typeof (value) !== 'number') {
            // TODO: consider logging an error and then returning the unknown token.
            throw TypeError('parseNumberSequence: expected a number.');
        }
        return { type: quantity_recognizer_1.QUANTITY, text, value };
    }
    parseTextSequence(sequence) {
        const terms = [];
        while (!sequence.atEOF()) {
            if (!this.lexicon.has(sequence.peek())) {
                terms.push(sequence.get());
            }
            else {
                break;
            }
        }
        if (terms.length === 0) {
            throw TypeError('parseTextSequence: expected a word.');
        }
        const text = terms.join(' ');
        return { type: tokenizer_1.UNKNOWN, text };
    }
    parseSequence(sequence) {
        const tokens = [];
        while (!sequence.atEOF()) {
            if (this.lexicon.has(sequence.peek())) {
                tokens.push(this.parseNumberSequence(sequence));
            }
            else {
                tokens.push(this.parseTextSequence(sequence));
            }
        }
        return tokens;
    }
}
exports.NumberRecognizer = NumberRecognizer;
//# sourceMappingURL=number_recognizer.js.map