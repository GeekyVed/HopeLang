import { RuntimeVal } from "./values";
export declare function createGlobalEnv(printHandler?: (msg: string) => void): Environment;
export default class Environment {
    private parent?;
    private variables;
    private constants;
    constructor(parentENV?: Environment);
    declareVar(varname: string, value: RuntimeVal, constant: boolean): RuntimeVal;
    assignVar(varname: string, value: RuntimeVal): RuntimeVal;
    lookupVar(varname: string): RuntimeVal;
    resolve(varname: string): Environment;
}
