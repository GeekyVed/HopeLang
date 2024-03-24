import { MK_BOOL, MK_NULL, RuntimeVal, MK_NATIVE_FN, MK_NUMBER } from "./values.ts";
import { timeFunction, printFunction } from "../native-fns/native-fx.ts"; 

export function createGlobalEnv() {
    const env = new Environment();
    // Create Default Global Enviornment
    env.declareVar("true", MK_BOOL(true), true);
    env.declareVar("false", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true);

    // Define a native builtin method
    env.declareVar("print", MK_NATIVE_FN(printFunction), true);
    env.declareVar("time", MK_NATIVE_FN(timeFunction), true);


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