import { RuntimeVal,NumberVal, MK_NUMBER } from "../../runtime/values.ts";
import Environment from "../../runtime/environment.ts";


export function sinFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1) {
        throw new Error("sin function expects exactly 1 argument.");
    }

    const arg = args[0];
    if (arg.type === "number") {
        const value = (arg as NumberVal).value;
        return MK_NUMBER(Math.sin(value));
    } else {
        throw new Error("sin function expects a number argument.");
    }
}

export function cosFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1) {
        throw new Error("cos function expects exactly 1 argument.");
    }

    const arg = args[0];
    if (arg.type === "number") {
        const value = (arg as NumberVal).value;
        return MK_NUMBER(Math.cos(value));
    } else {
        throw new Error("cos function expects a number argument.");
    }
}

export function tanFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1) {
        throw new Error("tan function expects exactly 1 argument.");
    }

    const arg = args[0];
    if (arg.type === "number") {
        const value = (arg as NumberVal).value;
        return MK_NUMBER(Math.tan(value));
    } else {
        throw new Error("tan function expects a number argument.");
    }
}


export function secFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1 || args[0].type !== "number") {
        throw new Error("sec function expects exactly 1 argument of type number.");
    }

    const num = args[0] as NumberVal;
    return MK_NUMBER(1 / Math.cos(num.value));
}

export function cscFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1 || args[0].type !== "number") {
        throw new Error("csc function expects exactly 1 argument of type number.");
    }

    const num = args[0] as NumberVal;
    return MK_NUMBER(1 / Math.sin(num.value));
}

export function cotFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1 || args[0].type !== "number") {
        throw new Error("cot function expects exactly 1 argument of type number.");
    }

    const num = args[0] as NumberVal;
    return MK_NUMBER(1 / Math.tan(num.value));
}

export function asinFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1 || args[0].type !== "number") {
        throw new Error("asin function expects exactly 1 argument of type number.");
    }

    const num = args[0] as NumberVal;
    return MK_NUMBER(Math.asin(num.value));
}

export function acosFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1 || args[0].type !== "number") {
        throw new Error("acos function expects exactly 1 argument of type number.");
    }

    const num = args[0] as NumberVal;
    return MK_NUMBER(Math.acos(num.value));
}

export function atanFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1 || args[0].type !== "number") {
        throw new Error("atan function expects exactly 1 argument of type number.");
    }

    const num = args[0] as NumberVal;
    return MK_NUMBER(Math.atan(num.value));
}