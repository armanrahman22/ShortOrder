import { PID, Recognizer, StemmerFunction, Token, TokenFactory, Tokenizer } from '.';
export interface Item {
    pid: PID;
    name: string;
    aliases: string[];
}
export declare class Index<T extends Item> {
    items: {
        [pid: number]: Item;
    };
    addItem: (item: T) => void;
}
export declare function indexYamlFilename(filename: string): Index<Item>;
export declare class PatternRecognizer<T extends Item> implements Recognizer {
    index: Index<T>;
    tokenizer: Tokenizer;
    tokenFactory: TokenFactory<Token>;
    stemmer: (word: string) => string;
    constructor(index: Index<T>, tokenFactory: TokenFactory<Token>, badWords: Set<string>, stemmer?: StemmerFunction, debugMode?: boolean);
    apply: (token: Token) => Token[];
    terms: () => Set<string>;
}
