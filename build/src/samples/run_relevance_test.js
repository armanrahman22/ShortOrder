"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = require("../tokenizer");
// This hacked stemmer exists solely to demonstrate pluggable stemmers.
function hackedStemmer(term) {
    const lowercase = term.toLowerCase();
    if (lowercase === 'fries' || lowercase === 'fried') {
        return lowercase;
    }
    return tokenizer_1.Tokenizer.defaultStemTerm(lowercase);
}
// runRelevanceTest(
//     './src/samples/data/menu.yaml',
//     './src/samples/data/intents.yaml',
//     './src/samples/data/attributes.yaml',
//     './src/samples/data/quantifiers.yaml',
//     './src/samples/data/tests.yaml',
//     hackedStemmer);
//# sourceMappingURL=run_relevance_test.js.map