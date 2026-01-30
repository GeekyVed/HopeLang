import Parser from "./frontend/parser";
import { createGlobalEnv } from "./runtime/environment";
import { evaluate } from "./runtime/interpreter";
/**
 * Runs the HopeLang code.
 * @param code The source code to run
 * @param outputCallback Callback function to handle print statements
 */
export declare function run(code: string, outputCallback: (msg: string) => void): void;
export { Parser, createGlobalEnv, evaluate };
