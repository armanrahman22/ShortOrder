"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pipeline_1 = require("../pipeline");
const stemmer_confusion_matrix_1 = require("../stemmer_confusion_matrix");
const tokenizer_1 = require("../tokenizer");
function stemmerConfusionDemo(menuFile, intentFile, attributesFile, quantifierFile) {
    const pipeline = new pipeline_1.Pipeline(menuFile, intentFile, attributesFile, quantifierFile, undefined);
    stemmer_confusion_matrix_1.stemmerConfusionMatrix(pipeline.compositeRecognizer, tokenizer_1.Tokenizer.defaultStemTerm);
}
exports.stemmerConfusionDemo = stemmerConfusionDemo;
// stemmerConfusionDemo(
//     './src/samples/data/menu.yaml',
//     './src/samples/data/intents.yaml',
//     './src/samples/data/attributes.yaml',
//     './src/samples/data/quantifiers.yaml');
//# sourceMappingURL=run_stemmer_confusion_matrix.js.map