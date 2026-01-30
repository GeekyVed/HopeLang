"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAnimationModule = setupAnimationModule;
const values_1 = require("../values");
function setupAnimationModule(env) {
    // move(steps)
    env.declareVar("move", (0, values_1.MK_NATIVE_FN)((args, scope) => {
        const steps = args[0].value;
        // Output a special command string that the frontend can parse
        // We use the 'print' function logic or just console.log?
        // The 'print' function in env is overriden by the host.
        // So we can use the 'print' variable from the scope!
        const printFn = scope.lookupVar("print");
        // Wait, print is a native fn, calling it inside native fn is hard if we don't have the JS function reference.
        // But we can just use console.log? No, 'run' overrides print.
        // We should probably rely on a 'emit' function injected into env?
        // Or simply: use `console.log` and ensure `run` captures stdout? 
        // No, `run` captures via callback.
        // Let's assume the Environment has a hidden "stdout" handler we can use?
        // OR: `setupAnimationModule` takes the `env`, so it can declare vars.
        // It doesn't know about the output callback.
        // Alternative: define `move` to return a value that the interpreter handles? No.
        // BEST APPROACH: 
        // React/Web frontend will provide a 'custom print handler'.
        // We will define `move` to call that handler.
        // But we don't have access to it here.
        // Let's use a "System Call" approach.
        // We will declare `move` which simply prints ">> MOVE <val>".
        // The frontend will hide lines starting with ">>" and interpret them as commands.
        // This is a common pattern for easy integration.
        // AND it works with the existing `run` architecture which pipes `print` output.
        const cmd = `>> MOVE ${steps}`;
        // We need to output this. 
        // We can look up `print` and call it?
        const printVal = scope.lookupVar("print");
        if (printVal.type == "native-fn") {
            // (printVal as NativeFnValue).call(args, scope); 
            // We need to construct string val.
            // This is getting complex to call internal 'print'.
        }
        // Simpler: Just allow the NativeFn to return a "SideEffect" or just use `console.log`?
        // If we use `console.log`, the CLI works. The `run` function in `index.ts` captured `print` calls, but `console.log` inside native modules might bypass it if `run` only overrides `print`.
        // FIX: The `run` function implementation in `src/index.ts` creates the global env.
        // Let's assume for now we `console.log`.
        // AND we update `src/index.ts` to capture `console.log`? No that's bad.
        // REVISIT `src/runtime/values.ts`: NativeFnCall signature is `(args, env)`.
        // It doesn't receive `stdout`.
        // I will use the "look up print" strategy. it is robust.
        // But `print` expects `RuntimeVal[]`.
        // I will implement a helper to call print.
        callHostPrint(scope, `>> MOVE ${steps}`);
        return (0, values_1.MK_NULL)();
    }), true);
    env.declareVar("turn", (0, values_1.MK_NATIVE_FN)((args, scope) => {
        const deg = args[0].value;
        callHostPrint(scope, `>> TURN ${deg}`);
        return (0, values_1.MK_NULL)();
    }), true);
}
function callHostPrint(env, msg) {
    const printVar = env.lookupVar("print");
    if (printVar.type === "native-fn") {
        printVar.call([{ type: "string", value: msg }], env);
    }
}
