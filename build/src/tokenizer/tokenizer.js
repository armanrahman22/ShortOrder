"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const murmurhash_1 = require("murmurhash");
const snowball_stemmers_1 = require("snowball-stemmers");
const best_path_1 = require("./best_path");
const diff_1 = require("./diff");
const tokens_1 = require("./tokens");
class Tokenizer {
    constructor(badWords, stemmer = Tokenizer.defaultStemTerm, debugMode = false) {
        this.debugMode = true;
        // Murmurhash seed.
        this.seed = 0;
        this.items = [];
        this.pids = [];
        this.hashedItems = [];
        this.stemmedItems = [];
        this.hashToText = {};
        this.hashToFrequency = {};
        this.postings = {};
        this.badWords = new Set();
        this.hashedBadWordsSet = new Set();
        // Arrow function to allow use in map.
        this.hashTerm = (term) => {
            return murmurhash_1.v3(term, this.seed);
        };
        // Arrow function to allow use in map.
        this.decodeTerm = (hash) => {
            if (hash in this.hashToText) {
                return this.hashToText[hash];
            }
            else {
                return `###HASH${hash}###`;
            }
        };
        this.decodeEdge = (edge) => {
            return `Edge("${this.items[edge.label]}", score=${edge.score}, length=${edge.length})`;
        };
        this.pidToName = (pid) => {
            return `ITEM_${pid}`;
        };
        this.markMatches = (terms, path) => {
            let termIndex = 0;
            const rewritten = [];
            path.forEach((edge) => {
                if (edge.label < 0) {
                    rewritten.push(terms[termIndex++]);
                }
                // TODO: EXPERIMENT 1: filter out badwords.
                else {
                    const text = `[${terms.slice(termIndex, termIndex + edge.length).join(' ')}]`;
                    rewritten.push(text);
                    termIndex += edge.length;
                }
            });
            return rewritten.join(' ');
        };
        this.replaceMatches = (terms, path, pidToName) => {
            let termIndex = 0;
            const rewritten = [];
            path.forEach((edge) => {
                if (edge.label < 0) {
                    rewritten.push(terms[termIndex++]);
                }
                // TODO: EXPERIMENT 1: filter out badwords.
                else {
                    // TODO: Where does toUpperCase and replacing spaces with
                    // underscores go?
                    const name = pidToName(this.pids[edge.label]);
                    const text = `[${name}]`;
                    rewritten.push(text);
                    termIndex += edge.length;
                }
            });
            return rewritten.join(' ');
        };
        this.tokenizeMatches = (terms, path, tokenFactory) => {
            let termIndex = 0;
            const tokens = [];
            path.forEach((edge, index) => {
                if (edge.label < 0) {
                    if (tokens.length === 0 ||
                        tokens[tokens.length - 1].type !== tokens_1.UNKNOWN) {
                        tokens.push({ type: tokens_1.UNKNOWN, text: terms[termIndex++] });
                    }
                    else {
                        const text = `${tokens[tokens.length - 1].text} ${terms[termIndex++]}`;
                        tokens[tokens.length - 1] = { type: tokens_1.UNKNOWN, text };
                    }
                }
                else {
                    const text = terms.slice(termIndex, termIndex + edge.length).join(' ');
                    tokens.push(tokenFactory(this.pids[edge.label], text));
                    termIndex += edge.length;
                }
            });
            return tokens;
        };
        this.badWords = badWords;
        this.stemTerm = stemmer;
        this.badWords.forEach((term) => {
            const hash = this.hashTerm(this.stemTerm(term));
            this.hashedBadWordsSet.add(hash);
        });
        this.debugMode = debugMode;
    }
    // TODO: printFrequencies()
    // TODO: printHashedItems()
    ///////////////////////////////////////////////////////////////////////////
    //
    // Indexing a phrase
    //
    ///////////////////////////////////////////////////////////////////////////
    addItem(pid, text) {
        // Internal id for this item. NOTE that the internal id is different
        // from the pid. The items "coke" and "coca cola" share a pid, but have
        // different ids.
        const id = this.items.length;
        this.items.push(text);
        this.pids.push(pid);
        // Split input string into individual terms.
        const terms = text.split(' ');
        const stemmed = terms.map(this.stemTerm);
        this.stemmedItems.push(stemmed.join(' '));
        const hashed = stemmed.map(this.hashTerm);
        this.hashedItems.push(hashed);
        hashed.forEach((hash, index) => {
            // Add this term to hash_to_text so that we can decode hashes later.
            if (!(hash in this.hashToText)) {
                this.hashToText[hash] = stemmed[index];
            }
            // Update term frequency
            // DESIGN ALTERNATIVE: could use lengths of posting lists instead.
            if (hash in this.hashToFrequency) {
                this.hashToFrequency[hash]++;
            }
            else {
                this.hashToFrequency[hash] = 1;
            }
            // Add current item to posting list for this term.
            // This is the inverted index.
            if (hash in this.postings) {
                this.postings[hash].push(id);
            }
            else {
                this.postings[hash] = [id];
            }
        });
        // TODO: Add tuples.
    }
    ///////////////////////////////////////////////////////////////////////////
    //
    // Indexing all tuples of a phrase.
    //
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    //
    // Full-text matching and scoring algorithm follows.
    //
    ///////////////////////////////////////////////////////////////////////////
    commonTerms(query, prefix) {
        const a = new Set(query);
        const b = new Set(prefix);
        return new Set([...a].filter(x => b.has(x)));
    }
    commonBadWords(commonTerms) {
        return new Set([...commonTerms].filter(x => this.hashedBadWordsSet.has(x)));
    }
    score(query, prefix) {
        const { match, cost, leftmostA, rightmostA, common } = diff_1.diff(query, prefix);
        // Ratio of match length to match length + edit distance.
        const matchFactor = match.length / (match.length + cost);
        // Ratio of match words common to query and prefix and length of match.
        const commonFactor = common / match.length;
        // EXPERIMENT: replace above line with one of the two following:
        // const commonFactor = common / (rightmostA + 1);
        // const commonFactor = common / rightmostA;
        const positionFactor = Math.max(match.length - leftmostA, 0) / match.length;
        const lengthFactor = rightmostA + 1;
        // This approach doesn't work because the match can contain trailing
        // garbage. Really need to count common terms that are not badwords.
        // TODO: fix matcher to not return trailing garbage. Example:
        //   query: 'large and add a Petaluma Chicken'
        //   prefix: 'large sprite;
        //   match: 'large and' instead of 'large'
        //
        // const nonBadWordCount = match.reduce((count, term) => {
        //     if (this.hashedBadWordsSet.has(term)) {
        //         return count;
        //     }
        //     else {
        //         return count + 1;
        //     }
        // }, 0);
        // const badWordFactor = nonBadWordCount / match.length;
        const commonTerms = this.commonTerms(query, prefix);
        const commonBadWords = this.commonBadWords(commonTerms);
        let score = matchFactor * commonFactor * positionFactor * lengthFactor;
        // if (nonBadWordCount === 0) {
        //     score = -1;
        // }
        // Exclude matches that are all badwords, except those that match every word
        // in the prefix. As long as "Fried" and "Fries" stem to the same word, this
        // prevents a collision between the entity, "Fries" and the attribute,
        // "Fried". Using a lemmatizer instead of a stemmer could also help here.
        const badWordFactor = (commonTerms.size - commonBadWords.size) / commonTerms.size;
        if (commonTerms.size === commonBadWords.size &&
            commonTerms.size !== prefix.length) {
            score = -1;
        }
        // if (score <= 0.25) {
        //     score = -1;
        // }
        if (score <= 0.01) {
            score = -1;
        }
        if (this.debugMode) {
            const queryText = query.map(this.decodeTerm).join(' ');
            const prefixText = prefix.map(this.decodeTerm).join(' ');
            const matchText = match.map(this.decodeTerm).join(' ');
            console.log(`      score=${score} mf=${matchFactor}, cf=${commonFactor}, pf=${positionFactor}, lf=${lengthFactor}, ff=${badWordFactor}`);
            console.log(`      length=${match.length}, cost=${cost}, left=${leftmostA}, right=${rightmostA}`);
            console.log(`      query="${queryText}"`);
            console.log(`      prefix="${prefixText}"`);
            console.log(`      match="${matchText}"`);
            console.log(`      query="${query}"`);
            console.log(`      prefix="${prefix}"`);
            console.log(`      match="${match}"`);
            console.log();
        }
        return { score, length: rightmostA + 1 };
    }
    // TODO: pass formatters here?
    // TODO: return terms and path, instead of strings?
    processQuery(query) {
        const terms = query.split(' ');
        const stemmed = terms.map(this.stemTerm);
        const hashed = stemmed.map(this.hashTerm);
        // const edgeLists: Array<Array<{ score: number, length: number }>> = [];
        const edgeLists = [];
        hashed.forEach((hash, index) => {
            // TODO: exclude starting at hashes that are conjunctions.
            if (hash in this.postings) {
                // This query term is in at least one product term.
                if (this.debugMode) {
                    const stemmedText = stemmed.slice(index).join(' ');
                    console.log(`  "${stemmedText}" SCORING:`);
                }
                // Get all of the items containing this query term.
                // Items not containing this term will match better
                // at other starting positions.
                const items = this.postings[hash];
                // Generate score for all of the items, matched against
                // the tail of the query.
                const tail = hashed.slice(index);
                const scored = items.map((item) => (Object.assign({}, this.score(tail, this.hashedItems[item]), { label: item })));
                const sorted = scored.sort((a, b) => b.score - a.score);
                edgeLists.push(sorted);
            }
            else {
                if (this.debugMode) {
                    console.log(`  "${stemmed[index]}" UNKNOWN`);
                }
                edgeLists.push([]);
            }
        });
        const path = best_path_1.findBestPath(edgeLists);
        if (this.debugMode) {
            console.log('edge list:');
            edgeLists.forEach((edges) => {
                const text = edges.map(this.decodeEdge).join(',');
                // const text = edges.map((edge) => `Edge(s=${edge.score},
                // l=${edge.length})`).join(', ');
                console.log(`    [${text}]`);
            });
            console.log('best path:');
            path.forEach((edge) => {
                console.log(`    ${this.decodeEdge(edge)}`);
            });
        }
        return path;
    }
}
Tokenizer.snowballStemmer = snowball_stemmers_1.newStemmer('english');
///////////////////////////////////////////////////////////////////////////
//
// Utility functions
//
///////////////////////////////////////////////////////////////////////////
// Arrow function to allow use in map.
Tokenizer.defaultStemTerm = (term) => {
    // if (term.toLowerCase() === 'fries' || term.toLowerCase() === 'fried')
    // {
    //     return term.toLowerCase();
    // }
    return Tokenizer.snowballStemmer.stem(term.toLowerCase());
};
exports.Tokenizer = Tokenizer;
//# sourceMappingURL=tokenizer.js.map