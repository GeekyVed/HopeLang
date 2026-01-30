
import { RuntimeVal } from "../values";
import { setupBlocodeModule } from "./blocode";
import Environment from "../environment";

export type ModuleLoader = (env: Environment) => void;

export const nativeModules: Map<string, ModuleLoader> = new Map();

// Register Modules
nativeModules.set("blocode", setupBlocodeModule);
