"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PeekableSequence {
    constructor(iterator) {
        this.iterator = iterator;
        this.current = this.iterator.next();
    }
    peek() {
        if (!this.current.done) {
            return this.current.value;
        }
        else {
            throw TypeError('PeekableSequence<T>.peek(): at end of stream.');
        }
    }
    get() {
        if (!this.current.done) {
            const value = this.current.value;
            this.current = this.iterator.next();
            return value;
        }
        else {
            throw TypeError('PeekableSequence<T>.get(): at end of stream.');
        }
    }
    atEOF() {
        return this.current.done;
    }
}
exports.PeekableSequence = PeekableSequence;
//# sourceMappingURL=peekable_sequence.js.map