import { MK_NULL, RuntimeVal, MK_NUMBER} from "../runtime/values.ts";
import Environment from "../runtime/environment.ts";


export function timeFunction(_args: RuntimeVal[], _env: Environment) {
    return MK_NUMBER(Date.now());
}

export function printFunction(args: RuntimeVal[], scope: Environment) {
    console.log(...args);
    return MK_NULL();
}

// export async function scanfFunction(_args: RuntimeVal[], _env: Environment): Promise<RuntimeVal> {
//     const buffer = new Uint8Array(1024); // Buffer to store user input
//     await Deno.stdout.write(new TextEncoder().encode("Enter input: "));
//     const n = await Deno.stdin.read(buffer); // Read input from stdin
//     const input = new TextDecoder().decode(buffer.subarray(0, n || undefined)); // Convert bytes to string
//     return { type: "string", value: input.trim() }; // Trim whitespace and return string value
// }
