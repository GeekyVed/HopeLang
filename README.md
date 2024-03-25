# <div align="center">HopeLang</div>

<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white"/>	<img alt="Deno" src="https://img.shields.io/badge/Deno-000000?style=for-the-badge&logo=Deno&logoColor=white"/>	<img alt="npm" src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"/>	<img alt="GitHub" src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white"/>


**HopeLang** is a programming language designed for simplicity and ease of learning. Built on TypeScript, it offers a smooth transition for developers familiar with TypeScript syntax. Dive into HopeLang to explore its intuitive constructs and enhance your programming skills.

## <div align="center">About HopeLang</div>

HopeLang was originally created as a personal project to gain a deeper understanding of system software components, including interpreters, compilers, lexers, parsers, and abstract syntax trees (ASTs). Designed with simplicity and ease of learning in mind, HopeLang serves as a beginner-friendly programming language built on TypeScript syntax.

## <div align="center">Features</div>

- **Simplicity:** HopeLang is designed to be easy to learn, making it perfect for beginners and those new to programming.
  
- **TypeScript-Based:** Built on TypeScript, HopeLang provides a familiar syntax for developers already comfortable with TypeScript.
  
- **Clear Syntax:** HopeLang's syntax is clear and concise, reducing the learning curve for new programmers.
  
- **Interactive REPL:** Includes an interactive REPL (Read-Eval-Print Loop) for experimenting with code snippets and learning interactively.
  
- **Support for Basic Data Types:** HopeLang supports basic data types such as numbers, booleans, and objects.
  
- **Functions:** Define and call functions to organize code into reusable blocks.
  
- **Mathematical Operations:** Built-in support for common mathematical operations like addition, subtraction, multiplication, and division.
  
- **Logical Operations:** Perform logical operations such as AND, OR, and NOT.
  
- **Error Handling:** Gracefully handles errors and provides informative error messages for easy debugging.

# <div align="center">Installation</div>

To use HopeLang, you can install it via npm or directly from GitHub. First, make sure you have Deno installed on your system. You can install Deno by following the instructions [here](https://deno.land/#installation).

## <div align="center">Install Deno</div>

### Windows:
To install Deno on Windows, open PowerShell and run the following command:
```powershell
irm https://deno.land/install.ps1 | iex
```

### macOS:
To install Deno on macOS, open Terminal and run the following command:

```bash
curl -fsSL https://deno.land/install.sh | sh
```

### Linux:
To install Deno on Linux, open Terminal and run the following command:

```bash
curl -fsSL https://deno.land/install.sh | sh
```


## <div align="center">Via npm</div>

You can install HopeLang via npm using the following command:

```bash
npm install -g hopelang
```
## <div align="center">Via GitHub</div>

Alternatively, you can install HopeLang directly from GitHub using the following command:

```bash
deno install -n hope --allow-read --allow-write https://raw.githubusercontent.com/GeekyVed/HopeLang/main/index.ts
```

# <div align="center">Usage</div>

After installation, you can use the `hope` command to run HopeLang scripts or open the REPL.

## <div align="center">Running Scripts</div>

To run a HopeLang script, use the following command:

```bash
hope <filename.hl>
```
Replace <filename.hl> with the path to your HopeLang script file.

## <div align="center">Interactive REPL

You can also use the interactive REPL to experiment with HopeLang code. Simply type `hope` without any arguments to enter the REPL mode.

```bash
hope
```

# <div align="center">Syntax</div>

Here's an overview of the syntax in HopeLang:

## <div align="center">Variables</div>

```typescript
let x = 10;
```

## <div align="center">Functions</div>

```typescript
function greet(x) {
     print(x)
}

const result = greet("Alice");
```

## <div align="center">Mathematical Operations</div>

```typescript
const sum = 10 + 5; // Addition
const difference = 10 - 5; // Subtraction
const product = 10 * 5; // Multiplication
const quotient = 10 / 5; // Division
```

## <div align="center">Logical Operations</div>

```typescript
const isTrue = true;
const isFalse = !isTrue; // Logical NOT
const bothTrue = true && true; // Logical AND
const eitherTrue = true || false; // Logical OR
```

## <div align="center">Object Literals</div>

Create object literals to represent structured data:

```typescript
const person = {
    name: "Alice",
    age: 30,
    greet() {
         "Hello, " + this.name + "!";
    }
};

const greeting = person.greet(); // "Hello, Alice!"
```

## <div align="center">Member Functions</div>

Define member functions within object literals to encapsulate behavior:

```typescript
const person = {
    name: "Alice",
    age: 30,
    greet() {
         "Hello, " + this.name + "!";
    },
    celebrateBirthday() {
        this.age++;
    }
};

person.celebrateBirthday();
print(person.age); // 31
```

## <div align="center">Arrays</div>

Create arrays to store collections of values:

```typescript
const numbers = [1, 2, 3, 4, 5];
const firstNumber = numbers[0]; // 1
```

## <div align="center">Control Flow</div>

Use control flow statements such as `if`, `else`, `while`, and `for`:

```typescript
let count = 0;

while (count < 5) {
    print(count);
    count++;
}
for (let i = 0; i < 5; i++) {
    print(i);
}
```

## <div align="center">Error Handling</div>

Handle errors using `try`, `catch`, and `throw`:

```typescript
try {
    // Code that might throw an error
} catch (error) {
    // Handle the error
    print(error);
}
```

## <div align="center">Built-in Functions</div>

HopeLang provides several built-in functions that perform common tasks:

1. **print**
   - **Description:** Prints the given arguments to the console.
   - **Syntax:** `print(arg1, arg2, ...)`
   - **Example:**
     ```typescript
     print(var); // Output: Hello world!
     ```

2. **time**
   - **Description:** Returns the current timestamp in milliseconds since the Unix epoch.
   - **Syntax:** `time()`
   - **Example:**
     ```typescript
     const currentTime = time();
     print(currentTime); // Output: Current timestamp in milliseconds
     ```

3. **Mathematical Functions**
   HopeLang provides various mathematical functions for common operations:
   - `sqrt`: Square root
   - `power`: Exponentiation
   - `min`: Minimum value among arguments
   - `max`: Maximum value among arguments
   - `round`: Rounds the number to the nearest integer
   - `abs`: Absolute value
   - `rand`: Generates a random number between 0 and 1
   - `ceil`: Rounds up to the nearest integer
   - `floor`: Rounds down to the nearest integer

4. **Trigonometric Functions**
   - `sin`: Sine function
   - `cos`: Cosine function
   - `tan`: Tangent function
   - `cot`: Cotangent function
   - `sec`: Secant function
   - `csc`: Cosecant function
   - `asin`: Arcsine function
   - `acos`: Arccosine function
   - `atan`: Arctangent function

5. **Logarithmic Functions**
   - `log`: Natural logarithm
   - `logten`: Base-10 logarithm
   - `exp`: Exponential function

## <div align="center">Usage Example

```typescript
// Import required functions
import { print, time, sqrt, power, min, max, round, abs, rand, ceil, floor, sin, cos, tan, cot, sec, csc, asin, acos, atan, log, logten, exp } from "hopelang";

// Example usage
print("Square root of 16:", sqrt(16));
print("2 to the power of 3:", power(2, 3));
print("Minimum of 10, 20, 30:", min(10, 20, 30));
print("Maximum of 10, 20, 30:", max(10, 20, 30));
print("Rounded value of 5.6:", round(5.6));
print("Absolute value of -10:", abs(-10));
print("Random number:", rand());
print("Ceiling of 5.3:", ceil(5.3));
print("Floor of 5.8:", floor(5.8));
print("Sine of 30 degrees:", sin(30));
print("Cosine of 45 degrees:", cos(45));
print("Tangent of 60 degrees:", tan(60));
print("Cotangent of 45 degrees:", cot(45));
print("Secant of 30 degrees:", sec(30));
print("Cosecant of 45 degrees:", csc(45));
print("Arcsine of 0.5:", asin(0.5));
print("Arccosine of 0.5:", acos(0.5));
print("Arctangent of 1:", atan(1));
print("Natural logarithm of 2:", log(2));
print("Base-10 logarithm of 100:", logten(100));
print("Exponential function of 2:", exp(2));
```

Get started with HopeLang today and embark on your journey to mastering programming with ease!

For more information and examples, check out the documentation and GitHub repository.

<div align="center">Made with ❤️ for everyone</div>
