import { repl, run } from "./main.ts";

const args = Deno.args;

if (args.length === 0) {
    // No file argument provided, open REPL
    repl();
} else {
    const filePath = args[0];
    if (!filePath.endsWith('.hl')) {
        console.error('Error: File must have ".hl" extension.');
        Deno.exit(1);
    }

    // Check if file exists
    try {
        await Deno.stat(filePath);
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            console.error(`Error: File "${filePath}" not found.`);
            Deno.exit(1);
        }
        console.error(`Error checking file "${filePath}":`, error);
        Deno.exit(1);
    }

    // Execute your Hopelang interpreter with the provided file
    console.log(`Running Hopelang file: ${filePath}`);
    run(filePath);
}
