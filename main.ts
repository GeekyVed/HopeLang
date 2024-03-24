import Parser from "./frontend/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_NULL, MK_NUMBER, MK_BOOL } from "./runtime/values.ts";
import { createGlobalEnv } from "./runtime/environment.ts";

//repl();
run("./test.txt");

async function run(filename: string) {
    const parser = new Parser();
    const env = createGlobalEnv();

    const input = await Deno.readTextFile(filename);
    const program = parser.produceAST(input);

    const result = evaluate(program, env);
    console.log(result);
}

function repl() {
    const parser = new Parser();

    //Making an environment and a set of default variables
    const env = new Environment();

    // Create Default Global Environment
    env.declareVar("x", MK_NUMBER(100), true);
    env.declareVar("true", MK_BOOL(true), true);
    env.declareVar("false", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true);

    console.log("\nRepl v0.1");

    // Continue Repl Until User Stops Or Types `exit`
    while (true) {
        const input = prompt("> ");
        // Check for no user input or exit keyword.
        if (!input || input.includes("exit")) {
            Deno.exit(1);
        }

        const program = parser.produceAST(input);

        const result = evaluate(program, env);
        console.log(result);
    }
}
