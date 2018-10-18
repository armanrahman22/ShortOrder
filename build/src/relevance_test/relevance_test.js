"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const yaml = require("js-yaml");
const tokenizer_1 = require("../tokenizer");
const utilities_1 = require("../utilities");
const pipeline_1 = require("../pipeline");
class Result {
    constructor(test, observed, passed) {
        this.test = test;
        this.observed = observed;
        this.passed = passed;
    }
}
exports.Result = Result;
class AggregatedResults {
    constructor() {
        this.priorities = {};
        this.suites = {};
        this.results = [];
        this.passCount = 0;
    }
    recordResult(result) {
        const test = result.test;
        const passed = result.passed;
        // Update pass/run counts for each suite associated with this test.
        test.suites.forEach((suite) => {
            if (!(suite in this.suites)) {
                this.suites[suite] = { passCount: 0, runCount: 0 };
            }
            const counts = this.suites[suite];
            counts.runCount++;
            if (passed) {
                counts.passCount++;
            }
        });
        // Update pass/run counts for this test's priority.
        if (!(test.priority in this.priorities)) {
            this.priorities[test.priority] = { passCount: 0, runCount: 0 };
        }
        const counts = this.priorities[test.priority];
        counts.runCount++;
        if (passed) {
            counts.passCount++;
        }
        this.results.push(result);
        if (passed) {
            this.passCount++;
        }
    }
    print() {
        console.log('Failing tests:');
        this.results.forEach((result => {
            if (!result.passed) {
                const suites = result.test.suites.join(' ');
                const passFail = result.passed ? "PASSED" : "FAILED";
                console.log(`${result.test.id} ${suites} - ${passFail}`);
                console.log(`   input "${result.test.input}"`);
                console.log(`  output "${result.observed}"`);
                console.log(`expected "${result.test.expected}"`);
                console.log();
            }
        }));
        console.log('Suites:');
        for (const [suite, counts] of Object.entries(this.suites)) {
            console.log(`  ${suite}: ${counts.passCount}/${counts.runCount}`);
        }
        console.log();
        console.log('Priorities:');
        for (const [priority, counts] of Object.entries(this.priorities)) {
            console.log(`  ${priority}: ${counts.passCount}/${counts.runCount}`);
        }
        console.log();
        console.log(`Overall: ${this.passCount}/${this.results.length}`);
    }
    rebase() {
        const baseline = this.results.map(result => {
            return {
                'priority': result.test.priority,
                'suites': result.test.suites.join(' '),
                'input': result.test.input,
                'expected': result.observed
            };
        });
        return baseline;
    }
}
exports.AggregatedResults = AggregatedResults;
class TestCase {
    constructor(id, priority, suites, input, expected) {
        this.id = id;
        this.priority = priority;
        this.suites = suites;
        this.input = input;
        this.expected = expected;
    }
    run(recognizer) {
        const input = { type: tokenizer_1.UNKNOWN, text: this.input };
        const tokens = recognizer.apply(input);
        const observed = tokens.map(pipeline_1.tokenToString).join(' ');
        const passed = (this.expected === observed);
        // if (!passed) {
        //     console.log('Failed:');
        //     console.log(`  "${this.input}"`);
        //     console.log(`  "${observed}"`);
        //     console.log(`  "${this.expected}"`);
        //     console.log('');
        // }
        return new Result(this, observed, passed);
    }
}
exports.TestCase = TestCase;
class RelevanceSuite {
    constructor(tests) {
        this.tests = [];
        this.tests = tests;
    }
    static fromYamlFilename(filename) {
        // tslint:disable-next-line:no-any
        const yamlTests = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
        if (!Array.isArray(yamlTests)) {
            throw TypeError('RelevanceTest: expected an array of tests.');
        }
        const tests = yamlTests.map((test, index) => {
            return new TestCase(index, utilities_1.copyScalar(test, 'priority', 'number').toString(), utilities_1.copyScalar(test, 'suites', 'string').split(' '), utilities_1.copyScalar(test, 'input', 'string'), utilities_1.copyScalar(test, 'expected', 'string'));
        });
        return new RelevanceSuite(tests);
    }
    run(recognizer) {
        const aggregator = new AggregatedResults();
        this.tests.forEach((test) => {
            aggregator.recordResult(test.run(recognizer));
        });
        aggregator.print();
        return aggregator;
    }
}
exports.RelevanceSuite = RelevanceSuite;
function runRelevanceTest(entityFile, intentsFile, attributesFile, quantifierFile, testFile, stemmer = tokenizer_1.Tokenizer.defaultStemTerm) {
    const pipeline = new pipeline_1.Pipeline(entityFile, intentsFile, attributesFile, quantifierFile, stemmer);
    const suite = RelevanceSuite.fromYamlFilename(testFile);
    return suite.run(pipeline.compositeRecognizer);
}
exports.runRelevanceTest = runRelevanceTest;
//# sourceMappingURL=relevance_test.js.map