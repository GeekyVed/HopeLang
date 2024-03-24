import { MK_BOOL, MK_NULL, RuntimeVal,NumberVal, MK_NATIVE_FN, MK_NUMBER } from "../runtime/values.ts";
import Environment from "../runtime/environment.ts";


export function timeFunction(_args: RuntimeVal[], _env: Environment) {
    return MK_NUMBER(Date.now());
}

export function printFunction(args: RuntimeVal[], scope: Environment) {
    console.log(...args);
    return MK_NULL();
}

export function sqrtFunction(args: RuntimeVal[], _env: Environment) {
    if (args.length !== 1) {
        throw new Error("sqrt function expects exactly 1 argument.");
    }

    const arg = args[0];
    if (arg.type == "number") {
        // if (arg.value < 0) {
        //     throw new Error("sqrt function cannot be applied to a negative number.");
        // }
        // return MK_NUMBER(Math.sqrt(arg.value));
    } else {
        throw new Error("sqrt function expects a number argument.");
    }
}