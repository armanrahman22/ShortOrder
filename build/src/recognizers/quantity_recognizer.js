"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = require("../tokenizer");
const tokenizer_2 = require("../tokenizer");
exports.QUANTITY = Symbol('QUANTITY');
function CreateQuantityRecognizer(intentFile, badWords, stemmer = tokenizer_2.Tokenizer.defaultStemTerm, debugMode = false) {
    const index = tokenizer_1.indexYamlFilename(intentFile);
    const tokenFactory = (id, text) => {
        const value = index.items[id].name;
        return { type: exports.QUANTITY, text, value: Number(value) };
    };
    return new tokenizer_1.PatternRecognizer(index, tokenFactory, badWords, stemmer, debugMode);
}
exports.CreateQuantityRecognizer = CreateQuantityRecognizer;
//# sourceMappingURL=quantity_recognizer.js.map