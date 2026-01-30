
import { RuntimeVal } from "../values";
import { setupBlocodeModule } from "./blocode";
import { setupPainterModule } from "./painter";
import { setupComposerModule } from "./composer";
import Environment from "../environment";

export type ModuleLoader = (env: Environment) => void;

export const nativeModules: Map<string, ModuleLoader> = new Map();

// Register Modules
nativeModules.set("blocode", setupBlocodeModule);
nativeModules.set("painter", setupPainterModule);
nativeModules.set("composer", setupComposerModule);
