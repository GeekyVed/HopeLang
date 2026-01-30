"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = exports.createGlobalEnv = exports.Parser = void 0;
exports.run = run;
const parser_1 = __importDefault(require("./frontend/parser"));
exports.Parser = parser_1.default;
const environment_1 = require("./runtime/environment");
Object.defineProperty(exports, "createGlobalEnv", { enumerable: true, get: function () { return environment_1.createGlobalEnv; } });
const interpreter_1 = require("./runtime/interpreter");
Object.defineProperty(exports, "evaluate", { enumerable: true, get: function () { return interpreter_1.evaluate; } });
/**
 * Runs the HopeLang code.
 * @param code The source code to run
 * @param outputCallback Callback function to handle print statements
 */
function run(code, outputCallback) {
    const parser = new parser_1.default();
    const env = (0, environment_1.createGlobalEnv)(outputCallback);
    const program = parser.produceAST(code);
    (0, interpreter_1.evaluate)(program, env);
}
