"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const tokenizer_1 = require("../../src/tokenizer");
describe('Tokenizer', () => {
    describe('#addItem', () => {
        it('should add item text to `this.items` and PIDs to `this.pids`', () => {
            const badWords = new Set([]);
            const tokenizer = new tokenizer_1.Tokenizer(badWords);
            const items = [[1, 'one'], [2, 'two'], [3, 'three']];
            items.forEach((item, index) => {
                const pid = item[0];
                const text = item[1];
                tokenizer.addItem(pid, text);
                chai_1.assert.equal(tokenizer.items.length, index + 1);
                chai_1.assert.equal(tokenizer.items[index], text);
                chai_1.assert.equal(tokenizer.pids[index], pid);
            });
        });
        it('should apply MurmurHash3 with seed value of 0.', () => {
            const badWords = new Set([]);
            const tokenizer = new tokenizer_1.Tokenizer(badWords);
            const input = 'small unsweeten ice tea';
            tokenizer.addItem(1, input);
            const observed = tokenizer.hashedItems[0];
            const expected = [2557986934, 1506511588, 4077993285, 1955911164];
            chai_1.assert.deepEqual(observed, expected);
        });
        it('should build posting lists.', () => {
            const badWords = new Set([]);
            const tokenizer = new tokenizer_1.Tokenizer(badWords);
            // DESIGN NOTE: the terms 'a'..'f' are known to stem to themselves.
            const items = ['a b c', 'b c d', 'd e f'];
            items.forEach((item, index) => {
                tokenizer.addItem(index, item);
            });
            // Verify that item text and stemmed item text are recorded.
            items.forEach((item, index) => {
                chai_1.assert.equal(tokenizer.items[index], items[index]);
                chai_1.assert.equal(tokenizer.stemmedItems[index], items[index]);
            });
            // Verify that posting lists are correct.
            const terms = ['a', 'b', 'c', 'd', 'e', 'f'];
            const expectedPostings = [
                [0],
                [0, 1],
                [0, 1],
                [1, 2],
                [2],
                [2] // f
            ];
            const observedPostings = terms.map((term) => tokenizer.postings[tokenizer.hashTerm(term)]);
            chai_1.assert.deepEqual(observedPostings, expectedPostings);
            // Verify that term frequencies are correct.
            const expectedFrequencies = [
                1,
                2,
                2,
                2,
                1,
                1 // f
            ];
            const observedFrequencies = terms.map((term) => tokenizer.hashToFrequency[tokenizer.hashTerm(term)]);
            chai_1.assert.deepEqual(observedFrequencies, expectedFrequencies);
        });
    });
    describe('#stemTerm', () => {
        it('should apply the Snowball English Stemmer', () => {
            const badWords = new Set([]);
            const tokenizer = new tokenizer_1.Tokenizer(badWords);
            const input = 'sauce chocolate milkshake hamburger value cheese creamy';
            const terms = input.split(' ');
            const stemmed = terms.map((term) => tokenizer.stemTerm(term));
            const observed = stemmed.join(' ');
            const expected = 'sauc chocol milkshak hamburg valu chees creami';
            chai_1.assert.equal(observed, expected);
        });
    });
});
//# sourceMappingURL=tokenizer.test.js.map