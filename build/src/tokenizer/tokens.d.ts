import { PID } from './types';
export declare const UNKNOWN: unique symbol;
export declare type UNKNOWN = typeof UNKNOWN;
export interface Token {
    type: symbol;
    text: string;
}
export interface UnknownToken extends Token {
    type: UNKNOWN;
    text: string;
}
export declare type TokenFactory<T> = (pid: PID, text: string) => T;
