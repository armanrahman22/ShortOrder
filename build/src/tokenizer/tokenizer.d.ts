import { Stemmer as SnowballStemmer } from 'snowball-stemmers';
import { Edge } from './best_path';
import { Token, TokenFactory } from './tokens';
import { HASH, ID, PID } from './types';
export declare type StemmerFunction = (term: string) => string;
export declare class Tokenizer {
    debugMode: boolean;
    static snowballStemmer: SnowballStemmer;
    stemTerm: StemmerFunction;
    seed: number;
    items: string[];
    pids: PID[];
    hashedItems: number[][];
    stemmedItems: string[];
    hashToText: {
        [hash: number]: string;
    };
    hashToFrequency: {
        [hash: number]: number;
    };
    postings: {
        [hash: number]: ID[];
    };
    badWords: Set<string>;
    hashedBadWordsSet: Set<number>;
    constructor(badWords: Set<string>, stemmer?: StemmerFunction, debugMode?: boolean);
    static defaultStemTerm: (term: string) => string;
    hashTerm: (term: string) => number;
    decodeTerm: (hash: number) => string;
    decodeEdge: (edge: Edge) => string;
    pidToName: (pid: number) => string;
    markMatches: (terms: string[], path: Edge[]) => string;
    replaceMatches: (terms: string[], path: Edge[], pidToName: (pid: number) => string) => string;
    tokenizeMatches: <T extends Token>(terms: string[], path: Edge[], tokenFactory: TokenFactory<T>) => Token[];
    addItem(pid: PID, text: string): void;
    commonTerms(query: HASH[], prefix: HASH[]): Set<number>;
    commonBadWords(commonTerms: Set<HASH>): Set<number>;
    score(query: number[], prefix: number[]): {
        score: number;
        length: number;
    };
    processQuery(query: string): Edge[];
}
