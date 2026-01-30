
import { NumberVal, RuntimeVal, MK_NULL, MK_NUMBER, MK_BOOL, MK_STRING, StringVal } from "./values";
import { AssignmentExpr, BinaryExpr, CallExpr, FunctionDeclaration, Identifier, IfStatement, NumericLiteral, ObjectLiteral, Program, Stmt, VarDeclaration, WhileStatement, StringLiteral, ReturnStatement, ImportStatement } from "../frontend/ast";
import Environment from "./environment";
import { nativeModules } from "./modules";

class ReturnException {
    value: RuntimeVal;
    constructor(val: RuntimeVal) {
        this.value = val;
    }
}

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
    switch (astNode.kind) {

        case "NumericLiteral":
            return { value: ((astNode as NumericLiteral).value), type: "number" } as NumberVal;

        case "StringLiteral":
            return { value: ((astNode as StringLiteral).value), type: "string" } as StringVal;

        case "Identifier":
            return eval_identifier(astNode as Identifier, env);

        case "ObjectLiteral":
            return eval_object_expr(astNode as ObjectLiteral, env);

        case "CallExpr":
            return eval_call_expr(astNode as CallExpr, env);

        case "AssignmentExpr":
            return eval_assignment(astNode as AssignmentExpr, env);

        case "BinaryExpr":
            return eval_binary_expr(astNode as BinaryExpr, env);

        case "Program":
            return eval_program(astNode as Program, env);

        case "VarDeclaration":
            return eval_var_declaration(astNode as VarDeclaration, env);

        case "FunctionDeclaration":
            return eval_function_declaration(astNode as FunctionDeclaration, env);

        case "IfStatement":
            return eval_if_statement(astNode as IfStatement, env);

        case "WhileStatement":
            return eval_while_statement(astNode as WhileStatement, env);

        case "ReturnStatement":
            throw new ReturnException(evaluate((astNode as ReturnStatement).value, env));

        case "ImportStatement":
            return eval_import_statement(astNode as ImportStatement, env);

        default:
            console.error("This AST Node has not yet been setup for interpretation.", astNode);
            throw new Error("This AST Node has not yet been setup for interpretation." + astNode.kind);
    }
}

function eval_program(program: Program, env: Environment): RuntimeVal {
    let lastEvaluated: RuntimeVal = MK_NULL();
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }
    return lastEvaluated;
}

function eval_var_declaration(declaration: VarDeclaration, env: Environment): RuntimeVal {
    const value = declaration.value ? evaluate(declaration.value, env) : MK_NULL();
    return env.declareVar(declaration.identifier, value, declaration.constant);
}

function eval_identifier(ident: Identifier, env: Environment): RuntimeVal {
    const val = env.lookupVar(ident.symbol);
    return val;
}

function eval_assignment(node: AssignmentExpr, env: Environment): RuntimeVal {
    if (node.assigne.kind !== "Identifier") {
        throw `Invalid LHS inside assignment expr ${JSON.stringify(node.assigne)}`;
    }
    const varname = (node.assigne as Identifier).symbol;
    const value = evaluate(node.value, env);

    try {
        // Try to assign to existing variable (in any scope)
        return env.assignVar(varname, value);
    } catch (e) {
        // If it doesn't exist, declare it in the current scope
        return env.declareVar(varname, value, false);
    }
}

function eval_object_expr(obj: ObjectLiteral, env: Environment): RuntimeVal {
    return { type: "object", properties: new Map() } as any; // Simplified for now
}

function eval_call_expr(expr: CallExpr, env: Environment): RuntimeVal {
    const args = expr.args.map(arg => evaluate(arg, env));
    const fn = evaluate(expr.caller, env);

    if (fn.type == "native-fn") {
        const result = (fn as any).call(args, env);
        return result;
    }

    if (fn.type == "function") {
        const func = fn as any;
        const scope = new Environment(func.declarationEnv);

        // Create the variables for the parameters list
        for (let i = 0; i < func.parameters.length; i++) {
            // TODO Check the bounds here.
            // verify arity of function
            const varname = func.parameters[i];
            scope.declareVar(varname, args[i], false);
        }

        let result: RuntimeVal = MK_NULL();
        // Evaluate the function body line by line
        try {
            for (const stmt of func.body) {
                result = evaluate(stmt, scope);
            }
        } catch (e) {
            if (e instanceof ReturnException) {
                return e.value;
            }
            throw e;
        }

        return result;
    }

    throw "Cannot call value that is not a function: " + JSON.stringify(fn);
}

function eval_binary_expr(binop: BinaryExpr, env: Environment): RuntimeVal {
    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);

    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(lhs as NumberVal, rhs as NumberVal, binop.operator);
    }

    // Equality Check for basic types
    if (binop.operator == "==") {
        // Handle boolean, string, number equality if not caught above
        // Simply check values?
        return { type: "boolean", value: (lhs as any).value === (rhs as any).value } as any; // Using simplified casting
    }

    // String concatenation
    if (lhs.type == "string" && rhs.type == "string" && binop.operator == "+") {
        return {
            type: "string",
            value: (lhs as StringVal).value + (rhs as StringVal).value,
        } as StringVal;
    }

    return MK_NULL();
}

function eval_numeric_binary_expr(lhs: NumberVal, rhs: NumberVal, operator: string): RuntimeVal {
    let result = 0;
    if (operator == "+") {
        result = lhs.value + rhs.value;
    } else if (operator == "-") {
        result = lhs.value - rhs.value;
    } else if (operator == "*") {
        result = lhs.value * rhs.value;
    } else if (operator == "/") {
        result = lhs.value / rhs.value;
    } else if (operator == "%") {
        result = lhs.value % rhs.value;
    } else if (operator == ">") {
        return MK_BOOL(lhs.value > rhs.value);
    } else if (operator == "<") {
        return MK_BOOL(lhs.value < rhs.value);
    } else if (operator == ">=") {
        return MK_BOOL(lhs.value >= rhs.value);
    } else if (operator == "<=") {
        return MK_BOOL(lhs.value <= rhs.value);
    } else if (operator == "==") {
        return MK_BOOL(lhs.value == rhs.value);
    } else if (operator == "!=") {
        return MK_BOOL(lhs.value != rhs.value);
    }

    return { value: result, type: "number" } as NumberVal;
}

function eval_import_statement(stmt: ImportStatement, env: Environment): RuntimeVal {
    const loader = nativeModules.get(stmt.moduleName);
    if (!loader) {
        throw `Module '${stmt.moduleName}' not found!`;
    }

    loader(env);
    return MK_NULL();
}

function eval_function_declaration(declaration: FunctionDeclaration, env: Environment): RuntimeVal {
    // Create new function value
    const fn = {
        type: "function",
        name: declaration.name,
        parameters: declaration.parameters,
        declarationEnv: env,
        body: declaration.body,
    } as any;

    return env.declareVar(declaration.name, fn, true);
}


function eval_if_statement(declaration: IfStatement, env: Environment): RuntimeVal {
    const condition = evaluate(declaration.condition, env);
    if ((condition as any).value) { // Assuming truthy
        const scope = new Environment(env);
        let result: RuntimeVal = MK_NULL();
        for (const stmt of declaration.body) {
            result = evaluate(stmt, scope);
        }
        return result;
    } else if (declaration.elseBody) {
        const scope = new Environment(env);
        let result: RuntimeVal = MK_NULL();
        for (const stmt of declaration.elseBody) {
            result = evaluate(stmt, scope);
        }
        return result;
    }
    return MK_NULL();
}

function eval_while_statement(stmt: WhileStatement, env: Environment): RuntimeVal {
    let result: RuntimeVal = MK_NULL();

    while (true) {
        const condition = evaluate(stmt.condition, env);
        if (!(condition as any).value) break;

        const scope = new Environment(env);
        for (const bodyStmt of stmt.body) {
            result = evaluate(bodyStmt, scope);
        }
    }

    return result;
}
