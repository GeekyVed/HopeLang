"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupBlocodeModule = setupBlocodeModule;
const values_1 = require("../values");
function setupBlocodeModule(env) {
    // move(steps)
    env.declareVar("move", (0, values_1.MK_NATIVE_FN)((args, scope) => {
        const steps = args[0].value;
        callHostPrint(scope, `>> MOVE ${steps}`);
        return (0, values_1.MK_NULL)();
    }), true);
    env.declareVar("turn", (0, values_1.MK_NATIVE_FN)((args, scope) => {
        const deg = args[0].value;
        callHostPrint(scope, `>> TURN ${deg}`);
        return (0, values_1.MK_NULL)();
    }), true);
}
function callHostPrint(env, msg) {
    const printVar = env.lookupVar("print");
    if (printVar.type === "native-fn") {
        printVar.call([{ type: "string", value: msg }], env);
    }
}
