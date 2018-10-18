import { Recognizer, StemmerFunction } from '../tokenizer';
export declare class Result {
    test: TestCase;
    observed: string;
    passed: boolean;
    constructor(test: TestCase, observed: string, passed: boolean);
}
export interface TestCounts {
    passCount: number;
    runCount: number;
}
export declare class AggregatedResults {
    priorities: {
        [priority: string]: TestCounts;
    };
    suites: {
        [suite: string]: TestCounts;
    };
    results: Result[];
    passCount: number;
    recordResult(result: Result): void;
    print(): void;
    rebase(): {
        'priority': string;
        'suites': string;
        'input': string;
        'expected': string;
    }[];
}
export declare class TestCase {
    id: number;
    priority: string;
    suites: string[];
    input: string;
    expected: string;
    constructor(id: number, priority: string, suites: string[], input: string, expected: string);
    run(recognizer: Recognizer): Result;
}
export declare class RelevanceSuite {
    private tests;
    static fromYamlFilename(filename: string): RelevanceSuite;
    constructor(tests: TestCase[]);
    run(recognizer: Recognizer): AggregatedResults;
}
export declare function runRelevanceTest(entityFile: string, intentsFile: string, attributesFile: string, quantifierFile: string, testFile: string, stemmer?: StemmerFunction): AggregatedResults;
