import { Recognizer, Token } from '../tokenizer';
export declare class NumberRecognizer implements Recognizer {
    lexicon: Set<string>;
    private parseNumberSequence;
    private parseTextSequence;
    private parseSequence;
    apply: (token: Token) => Token[];
    terms: () => Set<string>;
    stemmer: (word: string) => string;
}
