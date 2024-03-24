import { RuntimeVal,NumberVal, MK_NUMBER } from "../../runtime/values.ts";
import Environment from "../../runtime/environment.ts";

export function powerFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 2) {
        throw new Error("power function expects exactly 2 arguments.");
    }

    const base = args[0];
    const exponent = args[1];
    if (base.type == "number" && exponent.type == "number") {
        const baseValue = (base as NumberVal).value;
        const exponentValue = (exponent as NumberVal).value;
        return MK_NUMBER(Math.pow(baseValue, exponentValue));
    } else {
        throw new Error("power function expects number arguments.");
    }
} 

export function sqrtFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1) {
        throw new Error("sqrt function expects exactly 1 argument.");
    }

    const arg = args[0];
    if (arg.type == "number") {
        const value = (arg as NumberVal).value;
        if (value < 0) {
            throw new Error("sqrt function cannot be applied to a negative number.");
        }
        return MK_NUMBER(Math.sqrt(value));
    } else {
        throw new Error("sqrt function expects a number argument.");
    }
}

export function minFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length < 2) {
        throw new Error("min function expects at least 2 arguments.");
    }

    let minValue = Infinity;

    for (const arg of args) {
        if (arg.type !== "number") {
            throw new Error("min function expects arguments of type number.");
        }
        const value = (arg as NumberVal).value;
        if (arg.type === "number" && value < minValue) {
            minValue = value;
        }
    }

    return MK_NUMBER(minValue);
}

export function maxFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length < 2) {
        throw new Error("max function expects at least 2 arguments.");
    }

    let maxValue = -Infinity;

    for (const arg of args) {
        if (arg.type !== "number") {
            throw new Error("max function expects arguments of type number.");
        }
        const value = (arg as NumberVal).value;
        if (arg.type === "number" && value > maxValue) {
            maxValue = value;
        }
    }

    return MK_NUMBER(maxValue);
}

export function absFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1) {
        throw new Error("abs function expects exactly 1 argument.");
    }

    const arg = args[0];

    if (arg.type !== "number") {
        throw new Error("abs function expects an argument of type number.");
    }
    const value = (arg as NumberVal).value;
    const absoluteValue = Math.abs(value);

    return MK_NUMBER(absoluteValue);
}

export function roundFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1) {
        throw new Error("round function expects exactly 1 argument.");
    }

    const arg = args[0];

    if (arg.type !== "number") {
        throw new Error("round function expects an argument of type number.");
    }
    const value = (arg as NumberVal).value;
    const roundedValue = Math.round(value);

    return MK_NUMBER(roundedValue);
}

export function ceilFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1) {
        throw new Error("ceil function expects exactly 1 argument.");
    }

    const arg = args[0];
    if (arg.type === "number") {
        const value = (arg as NumberVal).value;
        return MK_NUMBER(Math.ceil(value));
    } else {
        throw new Error("ceil function expects a number argument.");
    }
}

export function floorFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1) {
        throw new Error("floor function expects exactly 1 argument.");
    }

    const arg = args[0];
    if (arg.type === "number") {
        const value = (arg as NumberVal).value;
        return MK_NUMBER(Math.floor(value));
    } else {
        throw new Error("floor function expects a number argument.");
    }
}

export function randomFunction(_args: RuntimeVal[], _env: Environment): RuntimeVal {
    return MK_NUMBER(Math.random());
}