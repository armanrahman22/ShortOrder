import { Item, PatternRecognizer } from '../tokenizer';
import { StemmerFunction, Token } from '../tokenizer';
export declare const QUANTITY: unique symbol;
export declare type QUANTITY = typeof QUANTITY;
export interface QuantityToken extends Token {
    type: QUANTITY;
    text: string;
    value: number;
}
export declare type QuantityRecognizer = PatternRecognizer<Item>;
export declare function CreateQuantityRecognizer(intentFile: string, badWords: Set<string>, stemmer?: StemmerFunction, debugMode?: boolean): QuantityRecognizer;
