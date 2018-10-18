"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = require("../tokenizer");
const tokenizer_2 = require("../tokenizer");
exports.INTENT = Symbol('INTENT');
function CreateIntentRecognizer(intentFile, badWords, stemmer = tokenizer_2.Tokenizer.defaultStemTerm, debugMode = false) {
    const index = tokenizer_1.indexYamlFilename(intentFile);
    const tokenFactory = (id, text) => {
        const name = index.items[id].name;
        return { type: exports.INTENT, id, name, text };
    };
    return new tokenizer_1.PatternRecognizer(index, tokenFactory, badWords, stemmer, debugMode);
}
exports.CreateIntentRecognizer = CreateIntentRecognizer;
//# sourceMappingURL=intent_recognizer.js.map