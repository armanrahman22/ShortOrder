"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_1 = require("../recognizers");
const recognizers_2 = require("../recognizers");
const recognizers_3 = require("../recognizers");
const recognizers_4 = require("../recognizers");
const recognizers_5 = require("../recognizers");
const tokenizer_1 = require("../tokenizer");
function tokenToString(t) {
    const token = t;
    let name;
    switch (token.type) {
        case recognizers_2.ATTRIBUTE:
            const attribute = token.name.replace(/\s/g, '_').toUpperCase();
            name = `[ATTRIBUTE:${attribute},${token.id}]`;
            break;
        case recognizers_3.ENTITY:
            const entity = token.name.replace(/\s/g, '_').toUpperCase();
            name = `[ENTITY:${entity},${token.pid}]`;
            break;
        case recognizers_4.INTENT:
            name = `[INTENT:${token.name}]`;
            break;
        case recognizers_5.QUANTITY:
            name = `[QUANTITY:${token.value}]`;
            break;
        default:
            name = `[UNKNOWN:${token.text}]`;
    }
    return name;
}
exports.tokenToString = tokenToString;
function printToken(t) {
    const token = t;
    let name;
    switch (token.type) {
        case recognizers_2.ATTRIBUTE:
            const attribute = token.name.replace(/\s/g, '_').toUpperCase();
            name = `ATTRIBUTE: ${attribute}(${token.id})`;
            break;
        case recognizers_3.ENTITY:
            const entity = token.name.replace(/\s/g, '_').toUpperCase();
            name = `ENTITY: ${entity}(${token.pid})`;
            break;
        case recognizers_4.INTENT:
            name = `INTENT: ${token.name}`;
            break;
        case recognizers_5.QUANTITY:
            name = `QUANTITY: ${token.value}`;
            break;
        default:
            name = 'UNKNOWN';
    }
    console.log(`${name}: "${token.text}"`);
}
exports.printToken = printToken;
function printTokens(tokens) {
    tokens.forEach(printToken);
    console.log();
}
exports.printTokens = printTokens;
class Pipeline {
    constructor(entityFile, intentsFile, attributesFile, quantifierFile, stemmer = tokenizer_1.Tokenizer.defaultStemTerm, debugMode = false) {
        this.intentRecognizer =
            recognizers_4.CreateIntentRecognizer(intentsFile, new Set(), stemmer, debugMode);
        this.quantityRecognizer =
            recognizers_5.CreateQuantityRecognizer(quantifierFile, new Set(), stemmer, debugMode);
        this.numberRecognizer = new recognizers_5.NumberRecognizer();
        const attributeBadWords = new Set([...this.quantityRecognizer.terms(), ...this.numberRecognizer.terms()]);
        this.attributeRecognizer = recognizers_2.CreateAttributeRecognizer(attributesFile, attributeBadWords, stemmer, debugMode);
        const entityBadWords = new Set([
            ...this.intentRecognizer.terms(), ...this.quantityRecognizer.terms(),
            ...this.attributeRecognizer.terms()
        ]);
        this.entityRecognizer =
            recognizers_3.CreateEntityRecognizer(entityFile, entityBadWords, stemmer, debugMode);
        this.compositeRecognizer = new recognizers_1.CompositeRecognizer([
            this.entityRecognizer, this.attributeRecognizer,
            this.numberRecognizer, this.quantityRecognizer, this.intentRecognizer
        ], debugMode);
    }
    processOneQuery(query, debugMode = false) {
        const input = { type: tokenizer_1.UNKNOWN, text: query };
        const tokens = this.compositeRecognizer.apply(input);
        return tokens;
    }
}
exports.Pipeline = Pipeline;
//# sourceMappingURL=pipeline.js.map