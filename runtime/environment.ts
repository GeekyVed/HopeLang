import { MK_BOOL, MK_NULL, RuntimeVal, MK_NATIVE_FN } from "./values.ts";
import { timeFunction, printFunction } from "../native-fns/native-fx.ts";
import { floorFunction, ceilFunction, randomFunction, absFunction, roundFunction, powerFunction, sqrtFunction, maxFunction, minFunction } from "../native-fns/math-fx/gen-math.ts";
import { sinFunction, cosFunction, tanFunction, cotFunction, secFunction, cscFunction, acosFunction, asinFunction, atanFunction } from "../native-fns/math-fx/trigo-math.ts";
import { log10Function, logFunction, expFunction } from "../native-fns/math-fx/log-math.ts";

export function createGlobalEnv() {
    const env = new Environment();
    // Create Default Global Enviornment
    env.declareVar("true", MK_BOOL(true), true);
    env.declareVar("false", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true);

    // Define a native builtin method
    env.declareVar("print", MK_NATIVE_FN(printFunction), true);
    env.declareVar("time", MK_NATIVE_FN(timeFunction), true);
    env.declareVar("sqrt", MK_NATIVE_FN(sqrtFunction), true);
    env.declareVar("power", MK_NATIVE_FN(powerFunction), true);
    env.declareVar("min", MK_NATIVE_FN(minFunction), true);
    env.declareVar("max", MK_NATIVE_FN(maxFunction), true);
    env.declareVar("round", MK_NATIVE_FN(roundFunction), true);
    env.declareVar("abs", MK_NATIVE_FN(absFunction), true);
    env.declareVar("rand", MK_NATIVE_FN(randomFunction), true);
    env.declareVar("ceil", MK_NATIVE_FN(ceilFunction), true);
    env.declareVar("floor", MK_NATIVE_FN(floorFunction), true);
    env.declareVar("sin", MK_NATIVE_FN(sinFunction), true);
    env.declareVar("cos", MK_NATIVE_FN(cosFunction), true);
    env.declareVar("tan", MK_NATIVE_FN(tanFunction), true);
    env.declareVar("cot", MK_NATIVE_FN(cotFunction), true);
    env.declareVar("sec", MK_NATIVE_FN(secFunction), true);
    env.declareVar("csc", MK_NATIVE_FN(cscFunction), true);
    env.declareVar("asin", MK_NATIVE_FN(asinFunction), true);
    env.declareVar("acos", MK_NATIVE_FN(acosFunction), true);
    env.declareVar("atan", MK_NATIVE_FN(atanFunction), true);
    env.declareVar("log", MK_NATIVE_FN(logFunction), true);
    env.declareVar("logten", MK_NATIVE_FN(log10Function), true);
    env.declareVar("exp", MK_NATIVE_FN(expFunction), true);

    return env;
}

// structure for scope AKA envionment
export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeVal>; //Way to define variables for the environment
    private constants: Set<string>;


    constructor(parentENV?: Environment) {
        const global = parentENV ? true : false;
        this.parent = parentENV;
        this.variables = new Map();
        this.constants = new Set();
    }

    public declareVar(varname: string, value: RuntimeVal, constant: boolean): RuntimeVal {
        if (this.variables.has(varname)) {
            throw `Cannot declare variable ${varname}. As it already is defined.`;
        }

        this.variables.set(varname, value);
        if (constant) {
            this.constants.add(varname);
        }
        return value; //returns the stored value
    }

    public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
        const env = this.resolve(varname);

        // Cannot assign to constant
        if (env.constants.has(varname)) {
            throw `Cannot reasign to variable ${varname} as it was declared constant.`;
        }


        env.variables.set(varname, value);
        return value;
    }

    public lookupVar(varname: string): RuntimeVal {
        const env = this.resolve(varname);
        return env.variables.get(varname) as RuntimeVal;
    }

    //Finding the env that has the var
    public resolve(varname: string): Environment {
        if (this.variables.has(varname)) {
            return this;
        }

        if (this.parent == undefined) {
            throw `Cannot resolve '${varname}' as it does not exist.`;
        }

        return this.parent.resolve(varname);
    }
}