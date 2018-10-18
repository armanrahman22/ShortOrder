import { CompositeRecognizer } from '../recognizers';
import { Recognizer, StemmerFunction, Token } from '../tokenizer';
export declare function tokenToString(t: Token): string;
export declare function printToken(t: Token): void;
export declare function printTokens(tokens: Token[]): void;
export declare class Pipeline {
    attributeRecognizer: Recognizer;
    entityRecognizer: Recognizer;
    intentRecognizer: Recognizer;
    numberRecognizer: Recognizer;
    quantityRecognizer: Recognizer;
    compositeRecognizer: CompositeRecognizer;
    constructor(entityFile: string, intentsFile: string, attributesFile: string, quantifierFile: string, stemmer?: StemmerFunction, debugMode?: boolean);
    processOneQuery(query: string, debugMode?: boolean): Token[];
}
