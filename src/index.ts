
import Parser from "./frontend/parser";
import { createGlobalEnv } from "./runtime/environment";
import { evaluate } from "./runtime/interpreter";
import { MK_NULL, MK_NATIVE_FN } from "./runtime/values";

/**
 * Runs the HopeLang code.
 * @param code The source code to run
 * @param outputCallback Callback function to handle print statements
 */
export function run(code: string, outputCallback: (msg: string) => void) {
    const parser = new Parser();
    const env = createGlobalEnv(outputCallback);

    const program = parser.produceAST(code);
    evaluate(program, env);
}

// Re-export specific parts for finer control if needed
export { Parser, createGlobalEnv, evaluate };
