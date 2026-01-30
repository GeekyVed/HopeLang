
import { RuntimeVal } from "../values";
import { setupAnimationModule } from "./animation";
import Environment from "../environment";

export type ModuleLoader = (env: Environment) => void;

export const nativeModules: Map<string, ModuleLoader> = new Map();

// Register Modules
nativeModules.set("animation", setupAnimationModule);
