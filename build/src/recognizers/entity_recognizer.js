"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const menu_1 = require("../menu");
const tokenizer_1 = require("../tokenizer");
exports.ENTITY = Symbol('ENTITY');
function CreateEntityRecognizer(entityFile, badWords, stemmer = tokenizer_1.Tokenizer.defaultStemTerm, debugMode = false) {
    const index = menu_1.Menu.fromYamlFilename(entityFile);
    const tokenFactory = (pid, text) => {
        const name = index.items[pid].name;
        return { type: exports.ENTITY, pid, name, text };
    };
    return new tokenizer_1.PatternRecognizer(index, tokenFactory, badWords, stemmer, debugMode);
}
exports.CreateEntityRecognizer = CreateEntityRecognizer;
//# sourceMappingURL=entity_recognizer.js.map