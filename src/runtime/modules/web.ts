
import { MK_NATIVE_FN, MK_NULL, RuntimeVal } from "../values";
import Environment from "../environment";

export function setupWebModule(env: Environment) {
    // heading(text, color)
    env.declareVar("heading", MK_NATIVE_FN((args, scope) => {
        const text = (args[0] as any).value || "";
        const color = (args[1] as any)?.value || "white";
        callHostPrint(scope, `>> WEB:HEADING ${text} | ${color}`);
        return MK_NULL();
    }), true);

    // text(text, color)
    env.declareVar("text", MK_NATIVE_FN((args, scope) => {
        const text = (args[0] as any).value || "";
        const color = (args[1] as any)?.value || "zinc-400";
        callHostPrint(scope, `>> WEB:TEXT ${text} | ${color}`);
        return MK_NULL();
    }), true);

    // button(text, color)
    env.declareVar("button", MK_NATIVE_FN((args, scope) => {
        const text = (args[0] as any).value || "";
        const color = (args[1] as any)?.value || "purple";
        callHostPrint(scope, `>> WEB:BUTTON ${text} | ${color}`);
        return MK_NULL();
    }), true);

    // card(title, body, color)
    env.declareVar("card", MK_NATIVE_FN((args, scope) => {
        const title = (args[0] as any).value || "";
        const body = (args[1] as any).value || "";
        const color = (args[2] as any)?.value || "zinc-800";
        callHostPrint(scope, `>> WEB:CARD ${title} | ${body} | ${color}`);
        return MK_NULL();
    }), true);

    // image(url)
    env.declareVar("image", MK_NATIVE_FN((args, scope) => {
        const url = (args[0] as any).value || "";
        callHostPrint(scope, `>> WEB:IMAGE ${url}`);
        return MK_NULL();
    }), true);

    // link(text, url, color)
    env.declareVar("link", MK_NATIVE_FN((args, scope) => {
        const text = (args[0] as any).value || "";
        const url = (args[1] as any).value || "#";
        const color = (args[2] as any)?.value || "blue";
        callHostPrint(scope, `>> WEB:LINK ${text} | ${url} | ${color}`);
        return MK_NULL();
    }), true);

    // badge(text, color)
    env.declareVar("badge", MK_NATIVE_FN((args, scope) => {
        const text = (args[0] as any).value || "";
        const color = (args[1] as any)?.value || "purple";
        callHostPrint(scope, `>> WEB:BADGE ${text} | ${color}`);
        return MK_NULL();
    }), true);

    // listItem(text, color)
    env.declareVar("listItem", MK_NATIVE_FN((args, scope) => {
        const text = (args[0] as any).value || "";
        const color = (args[1] as any)?.value || "zinc-400";
        callHostPrint(scope, `>> WEB:LIST_ITEM ${text} | ${color}`);
        return MK_NULL();
    }), true);

    // divider(color)
    env.declareVar("divider", MK_NATIVE_FN((args, scope) => {
        const color = (args[0] as any)?.value || "zinc-800";
        callHostPrint(scope, `>> WEB:DIVIDER ${color}`);
        return MK_NULL();
    }), true);

    // spacer(height)
    env.declareVar("spacer", MK_NATIVE_FN((args, scope) => {
        const height = (args[0] as any).value || 20;
        callHostPrint(scope, `>> WEB:SPACER ${height}`);
        return MK_NULL();
    }), true);
}

function callHostPrint(env: Environment, msg: string) {
    const printVar = env.lookupVar("print");
    if (printVar.type === "native-fn") {
        (printVar as any).call([{ type: "string", value: msg }], env);
    }
}
