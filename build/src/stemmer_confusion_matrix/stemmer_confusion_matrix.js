"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function stemmerConfusionMatrix(recognizer, stemmer) {
    const matrix = {};
    recognizer.terms().forEach(term => {
        const lower = term.toLowerCase();
        const stemmed = stemmer(lower);
        if (matrix[stemmed] === undefined) {
            matrix[stemmed] = new Set();
        }
        matrix[stemmed].add(lower);
    });
    Object.entries(matrix).forEach(([key, value]) => {
        if (value.size > 1) {
            const values = [...value].join(',');
            console.log(`"${key}": [${values}]`);
        }
    });
}
exports.stemmerConfusionMatrix = stemmerConfusionMatrix;
//# sourceMappingURL=stemmer_confusion_matrix.js.map