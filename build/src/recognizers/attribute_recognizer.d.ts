import { Item, PatternRecognizer } from '../tokenizer';
import { PID, StemmerFunction, Token } from '../tokenizer';
export declare const ATTRIBUTE: unique symbol;
export declare type ATTRIBUTE = typeof ATTRIBUTE;
export interface AttributeToken extends Token {
    type: ATTRIBUTE;
    text: string;
    id: PID;
    name: string;
}
export declare type AttributeRecognizer = PatternRecognizer<Item>;
export declare function CreateAttributeRecognizer(intentFile: string, badWords: Set<string>, stemmer?: StemmerFunction, debugMode?: boolean): AttributeRecognizer;
