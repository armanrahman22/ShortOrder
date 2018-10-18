"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-any
function copyScalar(item, property, type) {
    const value = item[property];
    if (value === undefined) {
        throw TypeError(`MenuItem: expects "${property}" property.`);
    }
    if (typeof (value) !== type) {
        throw TypeError(`MenuItem: "${property}" property should be type "${type}"`);
    }
    return value;
}
exports.copyScalar = copyScalar;
// tslint:disable-next-line:no-any
function copyArray(item, property, type) {
    const value = item[property];
    if (value === undefined) {
        throw TypeError(`MenuItem: expects "${property}" property.`);
    }
    if (typeof (value) !== 'object') {
        throw TypeError(`MenuItem: "${property}" property should be type "${type}[]"`);
    }
    value.forEach(element => {
        if (typeof (element) !== type) {
            throw TypeError(`MenuItem: "${property}" property should contain items of type "${type}"`);
        }
    });
    return value;
}
exports.copyArray = copyArray;
//# sourceMappingURL=type_checking.js.map