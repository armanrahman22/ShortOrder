import { Item, PatternRecognizer } from '../tokenizer';
import { PID, StemmerFunction, Token } from '../tokenizer';
export declare const INTENT: unique symbol;
export declare type INTENT = typeof INTENT;
export interface IntentToken extends Token {
    type: INTENT;
    text: string;
    id: PID;
    name: string;
}
export declare type IntentRecognizer = PatternRecognizer<Item>;
export declare function CreateIntentRecognizer(intentFile: string, badWords: Set<string>, stemmer?: StemmerFunction, debugMode?: boolean): IntentRecognizer;
