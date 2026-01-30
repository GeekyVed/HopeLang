
import { MK_NATIVE_FN, MK_NULL, RuntimeVal } from "../values";
import Environment from "../environment";

export function setupPainterModule(env: Environment) {
    // forward(steps)
    env.declareVar("forward", MK_NATIVE_FN((args, scope) => {
        const steps = (args[0] as any).value;
        callHostPrint(scope, `>> FORWARD ${steps}`);
        return MK_NULL();
    }), true);

    // turn(degrees)
    env.declareVar("turn", MK_NATIVE_FN((args, scope) => {
        const deg = (args[0] as any).value;
        callHostPrint(scope, `>> TURN ${deg}`);
        return MK_NULL();
    }), true);

    // penUp()
    env.declareVar("penUp", MK_NATIVE_FN((_args, scope) => {
        callHostPrint(scope, `>> PEN_UP`);
        return MK_NULL();
    }), true);

    // penDown()
    env.declareVar("penDown", MK_NATIVE_FN((_args, scope) => {
        callHostPrint(scope, `>> PEN_DOWN`);
        return MK_NULL();
    }), true);

    // setColor(color)
    env.declareVar("setColor", MK_NATIVE_FN((args, scope) => {
        const color = (args[0] as any).value;
        callHostPrint(scope, `>> COLOR ${color}`);
        return MK_NULL();
    }), true);

    // beginFill(color)
    env.declareVar("beginFill", MK_NATIVE_FN((args, scope) => {
        const color = (args[0] as any).value;
        callHostPrint(scope, `>> BEGIN_FILL ${color}`);
        return MK_NULL();
    }), true);

    // endFill()
    env.declareVar("endFill", MK_NATIVE_FN((_args, scope) => {
        callHostPrint(scope, `>> END_FILL`);
        return MK_NULL();
    }), true);
}

function callHostPrint(env: Environment, msg: string) {
    const printVar = env.lookupVar("print");
    if (printVar.type === "native-fn") {
        (printVar as any).call([{ type: "string", value: msg }], env);
    }
}
