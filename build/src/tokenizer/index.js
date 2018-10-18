"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var alias_generator_1 = require("./alias_generator");
exports.generateAliases = alias_generator_1.generateAliases;
var pattern_recognizer_1 = require("./pattern_recognizer");
exports.Index = pattern_recognizer_1.Index;
exports.indexYamlFilename = pattern_recognizer_1.indexYamlFilename;
exports.PatternRecognizer = pattern_recognizer_1.PatternRecognizer;
__export(require("./tokenizer"));
__export(require("./tokens"));
var diff_1 = require("./diff");
exports.diff = diff_1.diff;
//# sourceMappingURL=index.js.map