/******************************************************************************
 *
 * Levenshtein prefix distance.
 *
 * Given sequences a and b, compute the minimum Levenshtein distance match
 * between b and a prefix of a.
 *
 * This algorithm is intended to be used to evaluate potential partial matches
 * between catalog items and a longer phrases. Consider the following examples:
 *
 *   a: "The Pontiac Trans Am parked in the driveway"
 *   b: "The Pontiac" matches at positon 0 with edit distance 0.
 *   b: "Pontiac" matches at postion 1 with edit distance 1.
 *   b: "Pontiac Trans Am" matches at position 1 with edit distance 1.
 *   b: "Pontiac parked in the driveway" matches at position 1 with d=3.
 *
 * The algorithm can be applied to sequences represented as character string
 * and arrays. In the case of array-based sequences, one can pass an equality
 * predicate. The equality predicate is useful when performing pattern
 * matching against sequences of tokens. As an example:
 *
 *   a: [PURCHASE] [QUANTITY(5)] [ITEM(27)] [CONJUNCTION] [ITEM(43)]
 *   b: [PURCHASE] [QUANTITY(*)] [ITEM(*)]
 *
 * matches at position 0 with d=1, when using an equality predicate where
 * [QUANTITY(*)] is equal to any QUANTITY and ITEM(*) is equal to any ITEM.
 *
 ******************************************************************************/
export declare type EqualityPredicate<T> = (a: T, b: T) => boolean;
export interface DiffResults<T> {
    match: T[];
    cost: number;
    leftmostA: number;
    rightmostA: number;
    common: number;
}
export declare function diff<T>(query: T[], prefix: T[], predicate?: EqualityPredicate<T>): DiffResults<T>;
export declare function diffString(query: string, prefix: string): {
    cost: number;
    leftmostA: number;
    rightmostA: number;
    common: number;
    match: string;
};
