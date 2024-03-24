// Defining Value-Types since we dont know types of value at runtime
import Environment from "./environment.ts";
import {Stmt} from "../frontend/ast.ts";

export type ValueType = "null" | "number" | "boolean" | "object" | "native-fn"| "function";

export interface RuntimeVal {
    type: ValueType;
}

export interface NullVal extends RuntimeVal {
    type: "null";
    value: null;
}

export function MK_NULL() {
    return { type: "null", value: null } as NullVal;
}

export interface NumberVal extends RuntimeVal {
    type: "number";
    value: number;
}

//The default Value is 0
export function MK_NUMBER(n = 0) {
    return { type: "number", value: n } as NumberVal;
}

export interface BooleanVal extends RuntimeVal {
    type: "boolean";
    value: boolean;
}

//The default Value is 0
export function MK_BOOL(b = true) {
    return { type: "boolean", value: b } as BooleanVal;
}

export interface ObjectVal extends RuntimeVal {
    type: "object";
    properties: Map<string , RuntimeVal>;
}


export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal;

export interface NativeFnValue extends RuntimeVal {
	type: "native-fn";
	call: FunctionCall;
}
export function MK_NATIVE_FN(call: FunctionCall) {
	return { type: "native-fn", call } as NativeFnValue;
}

export interface FunctionValue extends RuntimeVal {
	type: "function";
	name: string;
	parameters: string[];
	declarationEnv: Environment;
	body: Stmt[];
}