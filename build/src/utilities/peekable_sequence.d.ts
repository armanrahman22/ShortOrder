export declare class PeekableSequence<T> {
    iterator: IterableIterator<T>;
    current: IteratorResult<T>;
    constructor(iterator: IterableIterator<T>);
    peek(): T;
    get(): T;
    atEOF(): boolean;
}
