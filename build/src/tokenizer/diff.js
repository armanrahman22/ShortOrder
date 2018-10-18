"use strict";
/******************************************************************************
 *
 * Levenshtein prefix distance.
 *
 * Given sequences a and b, compute the minimum Levenshtein distance match
 * between b and a prefix of a.
 *
 * This algorithm is intended to be used to evaluate potential partial matches
 * between catalog items and a longer phrases. Consider the following examples:
 *
 *   a: "The Pontiac Trans Am parked in the driveway"
 *   b: "The Pontiac" matches at positon 0 with edit distance 0.
 *   b: "Pontiac" matches at postion 1 with edit distance 1.
 *   b: "Pontiac Trans Am" matches at position 1 with edit distance 1.
 *   b: "Pontiac parked in the driveway" matches at position 1 with d=3.
 *
 * The algorithm can be applied to sequences represented as character string
 * and arrays. In the case of array-based sequences, one can pass an equality
 * predicate. The equality predicate is useful when performing pattern
 * matching against sequences of tokens. As an example:
 *
 *   a: [PURCHASE] [QUANTITY(5)] [ITEM(27)] [CONJUNCTION] [ITEM(43)]
 *   b: [PURCHASE] [QUANTITY(*)] [ITEM(*)]
 *
 * matches at position 0 with d=1, when using an equality predicate where
 * [QUANTITY(*)] is equal to any QUANTITY and ITEM(*) is equal to any ITEM.
 *
 ******************************************************************************/
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Types of edits used in dynamic programming algorithm.
var Edit;
(function (Edit) {
    Edit[Edit["NONE"] = 0] = "NONE";
    Edit[Edit["DELETE_A"] = 1] = "DELETE_A";
    Edit[Edit["DELETE_B"] = 2] = "DELETE_B";
    Edit[Edit["REPLACE"] = 3] = "REPLACE";
    Edit[Edit["MATCH"] = 4] = "MATCH"; // Both sequences match at this point.
})(Edit || (Edit = {}));
// Vertices corresepond to cells in the dynamic programming matrix.
class Vertex {
    constructor(cost) {
        this.edit = Edit.NONE;
        this.cost = cost;
    }
    // Compares a proposed path with the best known path through this vertex.
    // Updates vertex with new path if it corresponds to a lower edit distance.
    update(edit, cost) {
        if (this.edit === Edit.NONE) {
            // This is the first path considered, so it's the best we've seen
            // so far, so take it.
            this.cost = cost;
            this.edit = edit;
        }
        else if (cost < this.cost) {
            // This path is better than the best seen so far, so take it.
            this.cost = cost;
            this.edit = edit;
        }
    }
}
function GenericEquality(a, b) {
    return a === b;
}
class DiffMatrix {
    constructor(a, b, predicate = GenericEquality) {
        // Dynamic programming matrix.
        this.matrix = [];
        // Best sequence match and Levenshtein distance will be stored here once
        // the constructor exits.
        this.result = { match: [], cost: 0, leftmostA: 0, rightmostA: 0, common: 0 };
        this.a = a;
        this.b = b;
        this.predicate = predicate;
        this.aLen = a.length;
        this.bLen = b.length;
        this.initializeMatrix();
        this.findBestPath();
        this.tracePath();
    }
    // Initialize the dynamic programming matrix with a vertex at each cell.
    // Initialize delete path for sequence `a` (row 0) and sequence `b`
    // (column 0).
    initializeMatrix() {
        this.matrix = new Array(this.bLen + 1).fill([]);
        for (let j = 0; j <= this.bLen; ++j) {
            if (j === 0) {
                const row = new Array(this.aLen + 1);
                for (let i = 0; i <= this.aLen; ++i) {
                    row[i] = new Vertex(i);
                }
                this.matrix[j] = row;
            }
            else {
                const row = new Array(this.aLen + 1);
                row[0] = new Vertex(j);
                for (let i = 1; i <= this.aLen; ++i) {
                    row[i] = new Vertex(0);
                }
                this.matrix[j] = row;
            }
        }
    }
    // Dynamic programming algorithm fills in best edits and corresponding
    // Levenshtein distances at each vertex.
    findBestPath() {
        for (let j = 1; j <= this.bLen; ++j) {
            for (let i = 1; i <= this.aLen; ++i) {
                // Delete from A
                this.matrix[j][i].update(Edit.DELETE_A, this.matrix[j][i - 1].cost + 1);
                // Delete from B
                this.matrix[j][i].update(Edit.DELETE_B, this.matrix[j - 1][i].cost + 1);
                if (this.predicate(this.a[i - 1], this.b[j - 1])) {
                    // if (this.a[i - 1] === this.b[j - 1]) {
                    // Match
                    this.matrix[j][i].update(Edit.MATCH, this.matrix[j - 1][i - 1].cost);
                }
                else {
                    // Replace
                    this.matrix[j][i].update(Edit.REPLACE, this.matrix[j - 1][i - 1].cost + 1);
                }
            }
        }
    }
    // Walk backwards over best path, gathering match sequence, while computing
    // Levenshtein distance.
    tracePath() {
        const path = [];
        let ai = this.aLen;
        let bi = this.bLen;
        let current = this.matrix[bi][ai];
        let cost = current.cost;
        // Since we're doing a prefix match, we don't include the edits in the
        // suffix of sequence `a` that don't match sequence `b`. The suffix is
        // considered to be a consecutive sequence of deletes from `a` at the
        // end of the match.
        let inSuffix = true;
        let leftmostA = -1;
        let rightmostA = -1;
        let common = 0;
        while (current.edit !== Edit.NONE) {
            switch (current.edit) {
                case Edit.DELETE_A:
                    if (inSuffix) {
                        cost -= 1;
                    }
                    ai--;
                    leftmostA = ai;
                    break;
                case Edit.DELETE_B:
                    bi--;
                    break;
                case Edit.REPLACE:
                    // DESIGN NOTE: it is important to take the item from
                    // sequence `a` instead of `b`, in order to allow wildcards
                    // from `b` to match items in `a`. In other words, we don't
                    // want the match to contain the wildcard specifier from
                    // `b`. Rather we want to it to contain the item from `a`
                    // that matches the wildcard specifier.
                    path.push(this.a[ai - 1]);
                    // EXPERIMENT: replace above line with code below.
                    // if (!inSuffix) {
                    //     path.push(this.a[ai - 1]);
                    // }
                    ai--;
                    bi--;
                    // EXPERIMENT: comment out // inSuffix = false;
                    inSuffix = false;
                    leftmostA = ai;
                    break;
                case Edit.MATCH:
                    path.push(this.a[ai - 1]);
                    ai--;
                    bi--;
                    common++;
                    inSuffix = false;
                    leftmostA = ai;
                    break;
                default:
                    // Should never get here.
                    break;
            }
            if (rightmostA < 0 && !inSuffix) {
                rightmostA = ai;
            }
            current = this.matrix[bi][ai];
        }
        this.result = { match: path.reverse(), cost, leftmostA, rightmostA, common };
    }
}
// Generic sequence diff.
function diff(query, prefix, predicate = GenericEquality) {
    const d = new DiffMatrix(query, prefix, predicate);
    return d.result;
}
exports.diff = diff;
// String diff.
function diffString(query, prefix) {
    const a = [...query];
    const b = [...prefix];
    const d = new DiffMatrix(a, b);
    const _a = d.result, { match } = _a, rest = __rest(_a, ["match"]);
    return Object.assign({ match: match.join('') }, rest);
}
exports.diffString = diffString;
//# sourceMappingURL=diff.js.map