import { RuntimeVal } from "./values";
import { Stmt } from "../frontend/ast";
import Environment from "./environment";
export declare function evaluate(astNode: Stmt, env: Environment): RuntimeVal;
