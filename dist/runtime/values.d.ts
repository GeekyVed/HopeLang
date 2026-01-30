import { Stmt } from "../frontend/ast";
import Environment from "./environment";
export type ValueType = "null" | "number" | "boolean" | "object" | "native-fn" | "function" | "string";
export interface RuntimeVal {
    type: ValueType;
}
export interface NullVal extends RuntimeVal {
    type: "null";
    value: null;
}
export declare function MK_NULL(): NullVal;
export interface BooleanVal extends RuntimeVal {
    type: "boolean";
    value: boolean;
}
export declare function MK_BOOL(b?: boolean): BooleanVal;
export interface NumberVal extends RuntimeVal {
    type: "number";
    value: number;
}
export declare function MK_NUMBER(n?: number): NumberVal;
export interface StringVal extends RuntimeVal {
    type: "string";
    value: string;
}
export declare function MK_STRING(val: string): StringVal;
export interface ObjectVal extends RuntimeVal {
    type: "object";
    properties: Map<string, RuntimeVal>;
}
export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal;
export interface NativeFnValue extends RuntimeVal {
    type: "native-fn";
    call: FunctionCall;
}
export declare function MK_NATIVE_FN(call: FunctionCall): NativeFnValue;
export interface FunctionValue extends RuntimeVal {
    type: "function";
    name: string;
    parameters: string[];
    declarationEnv: Environment;
    body: Stmt[];
}
