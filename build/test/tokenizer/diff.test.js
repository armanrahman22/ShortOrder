"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const diff_1 = require("../../src/tokenizer/diff");
describe('Diff', () => {
    describe('#general', () => {
        it('should correctly match the prefix to the query string.', () => {
            const cases = [
                [
                    ['abcdef', 'ab'],
                    ['ab', 0, 0, 1, 2]
                ],
                [
                    ['abcdef', 'bcd'],
                    ['bcd', 1, 1, 3, 3]
                ],
                [
                    ['abcdef', 'cde'],
                    ['cde', 2, 2, 4, 3]
                ],
                [
                    ['abcdef', 'f'],
                    ['f', 5, 5, 5, 1]
                ],
                [['abcdef', 'ac'], ['ac', 1, 0, 2, 2]],
                [['abcdef', 'ad'], ['ad', 2, 0, 3, 2]],
                [['abcdef', 'adf'], ['adf', 3, 0, 5, 3]],
                [
                    ['a', 'af'],
                    ['a', 1, 0, 0, 1]
                ],
                [
                    ['a', 'def'],
                    ['a', 3, 0, 0, 0]
                ],
                [['abc', 'adc'], ['abc', 1, 0, 2, 2]] // Replace
            ];
            cases.forEach((item, index) => {
                const query = item[0][0];
                const prefix = item[0][1];
                const expectedMatch = item[1][0];
                const expectedCost = item[1][1];
                const expectedLeftmostA = item[1][2];
                const expectedRightmostA = item[1][3];
                const expectedCommon = item[1][4];
                const { match, cost, leftmostA, rightmostA, common } = diff_1.diffString(query, prefix);
                console.log(`"${query}" x "${prefix}" => "${match}", cost=${cost}, leftmost=${leftmostA}, rightmost=${rightmostA}, common=${common}`);
                chai_1.assert.equal(match, expectedMatch);
                chai_1.assert.equal(cost, expectedCost);
                chai_1.assert.equal(leftmostA, expectedLeftmostA);
                chai_1.assert.equal(rightmostA, expectedRightmostA);
                chai_1.assert.equal(common, expectedCommon);
            });
        });
    });
    describe('#predicate', () => {
        it('should work with an equality predicate.', () => {
            const query = [1, 2, 3, 4, 5];
            const prefix = [1, -1, 3];
            // const predicate = (x:number, y:number) => {
            function predicate(x, y) {
                if (y < 0) {
                    return true;
                }
                else {
                    return x === y;
                }
            }
            const expectedMatch = [1, 2, 3];
            const expectedCost = 0;
            const { match, cost, rightmostA } = diff_1.diff(query, prefix, predicate);
            chai_1.assert.deepEqual(match, expectedMatch);
            chai_1.assert.equal(cost, expectedCost);
        });
    });
    describe('#trailing junk', () => {
        it('should not produce a match with trailing junk.', () => {
            const query = [1, 2, 3, 4, 5];
            const prefix = [1, 6];
            const expectedMatch = [1, 2];
            const expectedCost = 1;
            const { match, cost, rightmostA } = diff_1.diff(query, prefix);
            chai_1.assert.deepEqual(match, expectedMatch);
            chai_1.assert.equal(cost, expectedCost);
        });
    });
});
//# sourceMappingURL=diff.test.js.map