"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = evaluate;
const values_1 = require("./values");
const environment_1 = __importDefault(require("./environment"));
const modules_1 = require("./modules");
class ReturnException {
    constructor(val) {
        this.value = val;
    }
}
function evaluate(astNode, env) {
    switch (astNode.kind) {
        case "NumericLiteral":
            return { value: (astNode.value), type: "number" };
        case "StringLiteral":
            return { value: (astNode.value), type: "string" };
        case "Identifier":
            return eval_identifier(astNode, env);
        case "ObjectLiteral":
            return eval_object_expr(astNode, env);
        case "CallExpr":
            return eval_call_expr(astNode, env);
        case "AssignmentExpr":
            return eval_assignment(astNode, env);
        case "BinaryExpr":
            return eval_binary_expr(astNode, env);
        case "Program":
            return eval_program(astNode, env);
        case "VarDeclaration":
            return eval_var_declaration(astNode, env);
        case "FunctionDeclaration":
            return eval_function_declaration(astNode, env);
        case "IfStatement":
            return eval_if_statement(astNode, env);
        case "WhileStatement":
            return eval_while_statement(astNode, env);
        case "ReturnStatement":
            throw new ReturnException(evaluate(astNode.value, env));
        case "ImportStatement":
            return eval_import_statement(astNode, env);
        default:
            console.error("This AST Node has not yet been setup for interpretation.", astNode);
            throw new Error("This AST Node has not yet been setup for interpretation." + astNode.kind);
    }
}
function eval_program(program, env) {
    let lastEvaluated = (0, values_1.MK_NULL)();
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }
    return lastEvaluated;
}
function eval_var_declaration(declaration, env) {
    const value = declaration.value ? evaluate(declaration.value, env) : (0, values_1.MK_NULL)();
    return env.declareVar(declaration.identifier, value, declaration.constant);
}
function eval_identifier(ident, env) {
    const val = env.lookupVar(ident.symbol);
    return val;
}
function eval_assignment(node, env) {
    if (node.assigne.kind !== "Identifier") {
        throw `Invalid LHS inside assignment expr ${JSON.stringify(node.assigne)}`;
    }
    const varname = node.assigne.symbol;
    const value = evaluate(node.value, env);
    try {
        // Try to assign to existing variable (in any scope)
        return env.assignVar(varname, value);
    }
    catch (e) {
        // If it doesn't exist, declare it in the current scope
        return env.declareVar(varname, value, false);
    }
}
function eval_object_expr(obj, env) {
    return { type: "object", properties: new Map() }; // Simplified for now
}
function eval_call_expr(expr, env) {
    const args = expr.args.map(arg => evaluate(arg, env));
    const fn = evaluate(expr.caller, env);
    if (fn.type == "native-fn") {
        const result = fn.call(args, env);
        return result;
    }
    if (fn.type == "function") {
        const func = fn;
        const scope = new environment_1.default(func.declarationEnv);
        // Create the variables for the parameters list
        for (let i = 0; i < func.parameters.length; i++) {
            // TODO Check the bounds here.
            // verify arity of function
            const varname = func.parameters[i];
            scope.declareVar(varname, args[i], false);
        }
        let result = (0, values_1.MK_NULL)();
        // Evaluate the function body line by line
        try {
            for (const stmt of func.body) {
                result = evaluate(stmt, scope);
            }
        }
        catch (e) {
            if (e instanceof ReturnException) {
                return e.value;
            }
            throw e;
        }
        return result;
    }
    throw "Cannot call value that is not a function: " + JSON.stringify(fn);
}
function eval_binary_expr(binop, env) {
    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);
    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(lhs, rhs, binop.operator);
    }
    // Equality Check for basic types
    if (binop.operator == "==") {
        // Handle boolean, string, number equality if not caught above
        // Simply check values?
        return { type: "boolean", value: lhs.value === rhs.value }; // Using simplified casting
    }
    // String concatenation
    if (lhs.type == "string" && rhs.type == "string" && binop.operator == "+") {
        return {
            type: "string",
            value: lhs.value + rhs.value,
        };
    }
    return (0, values_1.MK_NULL)();
}
function eval_numeric_binary_expr(lhs, rhs, operator) {
    let result = 0;
    if (operator == "+") {
        result = lhs.value + rhs.value;
    }
    else if (operator == "-") {
        result = lhs.value - rhs.value;
    }
    else if (operator == "*") {
        result = lhs.value * rhs.value;
    }
    else if (operator == "/") {
        result = lhs.value / rhs.value;
    }
    else if (operator == "%") {
        result = lhs.value % rhs.value;
    }
    else if (operator == ">") {
        return (0, values_1.MK_BOOL)(lhs.value > rhs.value);
    }
    else if (operator == "<") {
        return (0, values_1.MK_BOOL)(lhs.value < rhs.value);
    }
    else if (operator == ">=") {
        return (0, values_1.MK_BOOL)(lhs.value >= rhs.value);
    }
    else if (operator == "<=") {
        return (0, values_1.MK_BOOL)(lhs.value <= rhs.value);
    }
    else if (operator == "==") {
        return (0, values_1.MK_BOOL)(lhs.value == rhs.value);
    }
    else if (operator == "!=") {
        return (0, values_1.MK_BOOL)(lhs.value != rhs.value);
    }
    return { value: result, type: "number" };
}
function eval_import_statement(stmt, env) {
    const loader = modules_1.nativeModules.get(stmt.moduleName);
    if (!loader) {
        throw `Module '${stmt.moduleName}' not found!`;
    }
    loader(env);
    return (0, values_1.MK_NULL)();
}
function eval_function_declaration(declaration, env) {
    // Create new function value
    const fn = {
        type: "function",
        name: declaration.name,
        parameters: declaration.parameters,
        declarationEnv: env,
        body: declaration.body,
    };
    return env.declareVar(declaration.name, fn, true);
}
function eval_if_statement(declaration, env) {
    const condition = evaluate(declaration.condition, env);
    if (condition.value) { // Assuming truthy
        const scope = new environment_1.default(env);
        let result = (0, values_1.MK_NULL)();
        for (const stmt of declaration.body) {
            result = evaluate(stmt, scope);
        }
        return result;
    }
    else if (declaration.elseBody) {
        const scope = new environment_1.default(env);
        let result = (0, values_1.MK_NULL)();
        for (const stmt of declaration.elseBody) {
            result = evaluate(stmt, scope);
        }
        return result;
    }
    return (0, values_1.MK_NULL)();
}
function eval_while_statement(stmt, env) {
    let result = (0, values_1.MK_NULL)();
    while (true) {
        const condition = evaluate(stmt.condition, env);
        if (!condition.value)
            break;
        const scope = new environment_1.default(env);
        for (const bodyStmt of stmt.body) {
            result = evaluate(bodyStmt, scope);
        }
    }
    return result;
}
