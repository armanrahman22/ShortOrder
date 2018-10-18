"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pipeline_1 = require("../pipeline");
function pipelineDemo(menuFile, intentFile, attributesFile, quantifierFile, query, debugMode = false) {
    const pipeline = new pipeline_1.Pipeline(menuFile, intentFile, attributesFile, quantifierFile, undefined, debugMode);
    const tokens = pipeline.processOneQuery(query);
    console.log(`"${query}"`);
    console.log();
    pipeline_1.printTokens(tokens);
}
exports.pipelineDemo = pipelineDemo;
//# sourceMappingURL=pipeline_demo.js.map