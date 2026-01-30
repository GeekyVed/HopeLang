"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGlobalEnv = createGlobalEnv;
const values_1 = require("./values");
function createGlobalEnv(printHandler) {
    const env = new Environment();
    env.declareVar("true", (0, values_1.MK_BOOL)(true), true);
    env.declareVar("false", (0, values_1.MK_BOOL)(false), true);
    env.declareVar("null", (0, values_1.MK_NULL)(), true);
    // Native Functions
    const printFn = printHandler ? printHandler : (msg) => console.log(msg);
    env.declareVar("print", (0, values_1.MK_NATIVE_FN)((args, scope) => {
        const text = args.map(a => a.type === "number" ? a.value :
            a.type === "string" ? a.value :
                a.type === "boolean" ? a.value :
                    a.type === "null" ? "null" :
                        a).join(" ");
        printFn(text);
        return (0, values_1.MK_NULL)();
    }), true);
    env.declareVar("time", (0, values_1.MK_NATIVE_FN)(() => (0, values_1.MK_NUMBER)(Date.now())), true);
    return env;
}
class Environment {
    constructor(parentENV) {
        this.parent = parentENV;
        this.variables = new Map();
        this.constants = new Set();
    }
    declareVar(varname, value, constant) {
        if (this.variables.has(varname)) {
            throw `Cannot declare variable ${varname}. As it already is defined.`;
        }
        this.variables.set(varname, value);
        if (constant) {
            this.constants.add(varname);
        }
        return value;
    }
    assignVar(varname, value) {
        const env = this.resolve(varname);
        // Cannot assign to constant
        if (env.constants.has(varname)) {
            throw `Cannot reasign to variable ${varname} as it was declared constant.`;
        }
        env.variables.set(varname, value);
        return value;
    }
    lookupVar(varname) {
        const env = this.resolve(varname);
        return env.variables.get(varname);
    }
    resolve(varname) {
        if (this.variables.has(varname)) {
            return this;
        }
        if (this.parent == undefined) {
            throw `Cannot resolve '${varname}' as it does not exist.`;
        }
        return this.parent.resolve(varname);
    }
}
exports.default = Environment;
