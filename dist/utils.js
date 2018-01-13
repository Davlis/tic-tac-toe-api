"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.errorWrap = errorWrap;
exports.assertOrThrow = assertOrThrow;
function errorWrap(handler) {
    return function (...args) {
        handler(...args).catch(args[args.length - 1]);
    };
}

function assertOrThrow(statement, errorType, ...errorArgs) {
    if (!statement) {
        throw new errorType(...errorArgs);
    }
}