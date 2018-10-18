"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = require("../tokenizer");
function applyProcessor(processor, tokens) {
    const unflattened = tokens.map((token) => {
        if (token.type === tokenizer_1.UNKNOWN) {
            return processor(token);
        }
        else {
            return [token];
        }
    });
    const flattened = [].concat(...unflattened);
    return flattened;
}
class CompositeRecognizer {
    constructor(recognizers, debugMode = false) {
        this.recognizers = [];
        this.apply = (token) => {
            let result = [token];
            if (this.debugMode) {
                console.log('Input:');
                console.log(token);
                console.log();
            }
            this.recognizers.forEach((processor, index) => {
                result = applyProcessor(processor.apply, result);
                if (this.debugMode) {
                    console.log(`=== PASS ${index} ===`);
                    console.log(result);
                    console.log();
                }
            });
            return result;
        };
        this.terms = () => {
            const terms = new Set();
            this.recognizers.forEach(recognizer => {
                recognizer.terms().forEach(term => {
                    terms.add(term);
                });
            });
            return terms;
        };
        this.stemmer = (word) => {
            throw TypeError('CompositeRecognizer: stemmer not implemented.');
        };
        this.recognizers = recognizers;
        this.debugMode = debugMode;
    }
}
exports.CompositeRecognizer = CompositeRecognizer;
//# sourceMappingURL=composite_recognizer.js.map