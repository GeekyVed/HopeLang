
import Parser from "./frontend/parser";
import { createGlobalEnv } from "./runtime/environment";
import { evaluate } from "./runtime/interpreter";
import * as fs from "fs";
import * as readline from 'readline';

async function run(filename: string) {
    const parser = new Parser();
    const env = createGlobalEnv();

    const input = fs.readFileSync(filename, "utf-8");
    const program = parser.produceAST(input);

    evaluate(program, env);
}

function repl() {
    const parser = new Parser();
    const env = createGlobalEnv();

    console.log("\nHopeLang Repl v2.0");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '> '
    });

    rl.prompt();

    rl.on('line', (line) => {
        if (!line || line.includes("exit")) {
            process.exit(0);
        }

        try {
            const program = parser.produceAST(line);
            const result = evaluate(program, env);
            // console.log(result); // Optional: print result structure for debug
        } catch (e) {
            console.error(e);
        }
        rl.prompt();
    });
}

const args = process.argv.slice(2);
if (args.length > 0) {
    run(args[0]);
} else {
    repl();
}
