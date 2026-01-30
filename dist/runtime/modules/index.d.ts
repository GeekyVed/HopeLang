import Environment from "../environment";
export type ModuleLoader = (env: Environment) => void;
export declare const nativeModules: Map<string, ModuleLoader>;
