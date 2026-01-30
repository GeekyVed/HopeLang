"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = __importDefault(require("./frontend/parser"));
const environment_1 = require("./runtime/environment");
const interpreter_1 = require("./runtime/interpreter");
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
async function run(filename) {
    const parser = new parser_1.default();
    const env = (0, environment_1.createGlobalEnv)();
    const input = fs.readFileSync(filename, "utf-8");
    const program = parser.produceAST(input);
    (0, interpreter_1.evaluate)(program, env);
}
function repl() {
    const parser = new parser_1.default();
    const env = (0, environment_1.createGlobalEnv)();
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
            const result = (0, interpreter_1.evaluate)(program, env);
            // console.log(result); // Optional: print result structure for debug
        }
        catch (e) {
            console.error(e);
        }
        rl.prompt();
    });
}
const args = process.argv.slice(2);
if (args.length > 0) {
    run(args[0]);
}
else {
    repl();
}
