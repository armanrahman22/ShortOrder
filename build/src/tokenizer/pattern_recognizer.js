"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const yaml = require("js-yaml");
const utilities_1 = require("../utilities");
const _1 = require(".");
class Index {
    constructor() {
        this.items = {};
        this.addItem = (item) => {
            if (this.items[item.pid] === undefined) {
                this.items[item.pid] = item;
            }
            else {
                throw TypeError(`Index.addItem: found duplicate pid in item ${item}`);
            }
        };
    }
}
exports.Index = Index;
// tslint:disable-next-line:no-any
function ItemFromYamlItem(item) {
    return {
        pid: utilities_1.copyScalar(item, 'pid', 'number'),
        name: utilities_1.copyScalar(item, 'name', 'string'),
        aliases: utilities_1.copyArray(item, 'aliases', 'string'),
    };
}
function indexYamlFilename(filename) {
    // tslint:disable-next-line:no-any
    const yamlRoot = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
    if (typeof (yamlRoot) !== 'object') {
        throw TypeError('Inent: expected a top-level object with items array.');
    }
    const yamlItems = yamlRoot['items'];
    if (yamlItems === undefined || !Array.isArray(yamlRoot.items)) {
        throw TypeError('Intent: expected items array.');
    }
    const index = new Index();
    yamlItems.forEach(item => {
        index.addItem(ItemFromYamlItem(item));
    });
    return index;
}
exports.indexYamlFilename = indexYamlFilename;
class PatternRecognizer {
    constructor(index, tokenFactory, badWords, stemmer = _1.Tokenizer.defaultStemTerm, debugMode = false) {
        this.apply = (token) => {
            const path = this.tokenizer.processQuery(token.text);
            const terms = token.text.split(' ');
            return this.tokenizer.tokenizeMatches(terms, path, this.tokenFactory);
        };
        this.terms = () => {
            const terms = new Set();
            Object.entries(this.index.items).forEach(([pid, item]) => {
                item.aliases.forEach(alias => {
                    const words = alias.split(' ');
                    words.forEach(word => {
                        terms.add(word);
                    });
                });
            });
            return terms;
        };
        this.index = index;
        this.tokenizer = new _1.Tokenizer(badWords, stemmer, debugMode);
        this.stemmer = this.tokenizer.stemTerm;
        this.tokenFactory = tokenFactory;
        // Ingest index.
        let aliasCount = 0;
        Object.entries(this.index.items).forEach(([pid, item]) => {
            item.aliases.forEach(aliasPattern => {
                // console.log(aliasPattern);
                for (const alias of _1.generateAliases(aliasPattern)) {
                    // console.log(`  ${alias}`);
                    this.tokenizer.addItem(item.pid, alias);
                    aliasCount++;
                }
            });
        });
        // TODO: print name of tokenizer here?
        console.log(`${Object.keys(this.index.items).length} items contributed ${aliasCount} aliases.`);
        console.log();
    }
}
exports.PatternRecognizer = PatternRecognizer;
//# sourceMappingURL=pattern_recognizer.js.map