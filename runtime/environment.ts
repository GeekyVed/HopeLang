import { RuntimeVal } from "./values.ts";

// structure for scope AKA envionment
export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeVal>; //Way to define variables for the environment

    constructor(parentENV?: Environment) {
        this.parent = parentENV;
        this.variables = new Map();
    }

    public declareVar(varname: string, value: RuntimeVal): RuntimeVal {
        if (this.variables.has(varname)) {
            throw `Cannot declare variable ${varname}. As it already is defined.`;
        }

        this.variables.set(varname, value);
        return value; //returns the stored value
    }

    public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
        const env = this.resolve(varname);
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