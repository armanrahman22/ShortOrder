"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pipeline_1 = require("../pipeline");
const readlineSync = require("readline-sync");
function repl(menuFile, intentFile, attributesFile, quantifierFile) {
    console.log('Welcome to the ShortOrder REPL.');
    console.log('Type your order below.');
    console.log('A blank line exits.');
    console.log();
    const pipeline = new pipeline_1.Pipeline(menuFile, intentFile, attributesFile, quantifierFile);
    while (true) {
        const line = readlineSync.question('% ');
        if (line.length === 0) {
            console.log('bye');
            break;
        }
        console.log();
        const tokens = pipeline.processOneQuery(line);
        tokens.forEach(pipeline_1.printToken);
        console.log();
    }
}
exports.repl = repl;
function runRepl() {
    repl('./src/samples/data/menu.yaml', './src/samples/data/intents.yaml', './src/samples/data/attributes.yaml', './src/samples/data/quantifiers.yaml');
}
exports.runRepl = runRepl;
//# sourceMappingURL=repl.js.map