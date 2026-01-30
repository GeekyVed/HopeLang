
import { MK_NATIVE_FN, MK_NULL, RuntimeVal } from "../values";
import Environment from "../environment";

export function setupComposerModule(env: Environment) {
    // note(pitch, duration)
    env.declareVar("note", MK_NATIVE_FN((args, scope) => {
        const pitch = (args[0] as any).value;
        const duration = (args[1] as any).value;
        callHostPrint(scope, `>> NOTE ${pitch} ${duration}`);
        return MK_NULL();
    }), true);

    // chord(notes, duration)
    env.declareVar("chord", MK_NATIVE_FN((args, scope) => {
        const notes = (args[0] as any).value; // Should be an array of strings
        const duration = (args[1] as any).value;

        // Convert notes array to a format the parser expects
        const notesStr = JSON.stringify(notes.map((n: any) => n.value || n));
        callHostPrint(scope, `>> CHORD ${notesStr} ${duration}`);
        return MK_NULL();
    }), true);

    // rest(duration)
    env.declareVar("rest", MK_NATIVE_FN((args, scope) => {
        const duration = (args[0] as any).value;
        callHostPrint(scope, `>> REST ${duration}`);
        return MK_NULL();
    }), true);

    // tempo(bpm)
    env.declareVar("tempo", MK_NATIVE_FN((args, scope) => {
        const bpm = (args[0] as any).value;
        callHostPrint(scope, `>> TEMPO ${bpm}`);
        return MK_NULL();
    }), true);

    // instrument(name)
    env.declareVar("instrument", MK_NATIVE_FN((args, scope) => {
        const name = (args[0] as any).value;
        callHostPrint(scope, `>> INSTRUMENT ${name}`);
        return MK_NULL();
    }), true);
}

function callHostPrint(env: Environment, msg: string) {
    const printVar = env.lookupVar("print");
    if (printVar.type === "native-fn") {
        (printVar as any).call([{ type: "string", value: msg }], env);
    }
}
