
# HopeLang 🌟

**HopeLang** is a kid-friendly programming language designed for simplicity. It features a clean syntax without semicolons or curly brackets, making it perfect for learning to code.

## 🚀 Quick Start

### Installation

```bash
npm install
npm run build
```

### Using the CLI (Terminal)

You can run HopeLang scripts (`.hl` files) directly from your terminal:

```bash
# Run a specific file
npm run start test.hl
```

### Using the REPL (Interactive Mode)

Type code and see results immediately in the Read-Eval-Print Loop:

```bash
# Start REPL
npm run start
```

**Commands:**
- Type any HopeLang code (e.g., `print "Hello"`)
- Type `exit` to quit.

## 🌐 Connecting to a Website

HopeLang is designed to be easily embedded in web applications (like a playground).

### Integration Steps

1.  **Import the Library**:
    HopeLang exports a `run` function from `src/index.ts`.

2.  **Usage in JavaScript/TypeScript Code**:

    ```typescript
    import { run } from "hopelang"; // Verify path to your build

    const myCode = `
    print "Hello from the Playground!"
    let x = 100
    print x * 2
    `;

    // The run function accepts the code and a callback for output
    run(myCode, (output) => {
        // This callback is called whenever 'print' is used in HopeLang
        console.log("HopeLang says:", output);
        
        // Example: Update a terminal UI element
        // myTerminal.writeLine(output);
    });
    ```

### How it works
- The `run` function sets up a new environment.
- It overrides the native `print` function to pipe output to your callback instead of the console.
- This allows you to display code output in a custom UI (like a web terminal).

## 📖 Documentation
For the full syntax guide and examples, please read [docs.md](./docs.md).

---
Made with ❤️ for Kids!
