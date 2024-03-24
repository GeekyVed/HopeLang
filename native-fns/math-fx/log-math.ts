import { RuntimeVal, MK_NUMBER,NumberVal} from "../../runtime/values.ts";
import Environment from "../../runtime/environment.ts";

export function expFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1 || args[0].type !== "number") {
        throw new Error("exp function expects exactly 1 argument of type number.");
    }

    const num = args[0] as NumberVal;
    return MK_NUMBER(Math.exp(num.value));
}

export function logFunction(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1 || args[0].type !== "number") {
        throw new Error("log function expects exactly 1 argument of type number.");
    }

    const num = args[0] as NumberVal;
    return MK_NUMBER(Math.log(num.value));
}

export function log10Function(args: RuntimeVal[], _env: Environment): RuntimeVal {
    if (args.length !== 1 || args[0].type !== "number") {
        throw new Error("log10 function expects exactly 1 argument of type number.");
    }

    const num = args[0] as NumberVal;
    return MK_NUMBER(Math.log10(num.value));
}
