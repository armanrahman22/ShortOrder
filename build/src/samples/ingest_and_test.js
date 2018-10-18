"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recognizers_1 = require("../recognizers");
const tokenizer_1 = require("../tokenizer");
function run(recognizer, query) {
    const input = { type: tokenizer_1.UNKNOWN, text: query };
    const tokens = recognizer.apply(input);
    const observed = tokens.map(t => {
        const token = t;
        if (token.type === recognizers_1.ENTITY) {
            const entity = token.name.replace(/\s/g, '_').toUpperCase();
            return `[${entity}(${token.pid})]`;
        }
        else {
            return token.text;
        }
    }).join(' ');
    console.log(`Returned: "${observed}"`);
    console.log();
}
function ingestAndTest(menuFile, query) {
    const badWords = new Set();
    const recognizer = recognizers_1.CreateEntityRecognizer(menuFile, badWords);
    run(recognizer, query);
}
exports.ingestAndTest = ingestAndTest;
// ingestAndTest(
//     './src/samples/data/menu.yaml',
//     'can I have two hamburgers'
//     // "Uh yeah I'd like a pet chicken fries and a coke"
//     // 'Dakota burger with extra swiss cheese'
// );
//# sourceMappingURL=ingest_and_test.js.map