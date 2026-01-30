
import { MK_NATIVE_FN, MK_NULL, MK_NUMBER, RuntimeVal } from "../values";
import Environment from "../environment";

export function setupBlocodeModule(env: Environment) {
    // move(steps)
    env.declareVar("move", MK_NATIVE_FN((args, scope) => {
        const steps = (args[0] as any).value;
        callHostPrint(scope, `>> MOVE ${steps}`);
        return MK_NULL();
    }), true);

    env.declareVar("turn", MK_NATIVE_FN((args, scope) => {
        const deg = (args[0] as any).value;
        callHostPrint(scope, `>> TURN ${deg}`);
        return MK_NULL();
    }), true);
}

function callHostPrint(env: Environment, msg: string) {
    const printVar = env.lookupVar("print");
    if (printVar.type === "native-fn") {
        (printVar as any).call([{ type: "string", value: msg }], env);
    }
}
