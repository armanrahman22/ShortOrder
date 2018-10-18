import { Recognizer, Token } from '../tokenizer';
export declare class CompositeRecognizer implements Recognizer {
    recognizers: Recognizer[];
    debugMode: boolean;
    constructor(recognizers: Recognizer[], debugMode?: boolean);
    apply: (token: Token) => Token[];
    terms: () => Set<string>;
    stemmer: (word: string) => string;
}
