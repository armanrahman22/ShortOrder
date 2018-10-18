import { MenuItem } from '../menu';
import { PatternRecognizer, PID, StemmerFunction, Token } from '../tokenizer';
export declare const ENTITY: unique symbol;
export declare type ENTITY = typeof ENTITY;
export interface EntityToken extends Token {
    type: ENTITY;
    text: string;
    pid: PID;
    name: string;
}
export declare type EntityRecognizer = PatternRecognizer<MenuItem>;
export declare function CreateEntityRecognizer(entityFile: string, badWords: Set<string>, stemmer?: StemmerFunction, debugMode?: boolean): PatternRecognizer<MenuItem>;
