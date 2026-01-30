"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MK_NULL = MK_NULL;
exports.MK_BOOL = MK_BOOL;
exports.MK_NUMBER = MK_NUMBER;
exports.MK_STRING = MK_STRING;
exports.MK_NATIVE_FN = MK_NATIVE_FN;
function MK_NULL() {
    return { type: "null", value: null };
}
function MK_BOOL(b = true) {
    return { type: "boolean", value: b };
}
function MK_NUMBER(n = 0) {
    return { type: "number", value: n };
}
function MK_STRING(val) {
    return { type: "string", value: val };
}
function MK_NATIVE_FN(call) {
    return { type: "native-fn", call };
}
