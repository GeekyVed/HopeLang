
// TokenType.ts
export enum TokenType {
    // Literal Types
    Number,
    Identifier,
    String, // "Hello"

    // Keywords
    Let, // let or var (implicit?) - we'll implement 'var' for explicit 
    Fn,
    If,
    Else,
    While,
    For,
    Return,
    End, // Closes blocks
    Print, // print statement
    Import, // import statement

    // English Operators
    And, // &&
    Or,  // ||
    Not, // !

    // Grouping * Operators
    BinaryOperator, // + - * / %
    Equals, // =
    Equivalence, // ==
    OpenParen, // (
    CloseParen, // )
    Comma, // ,
    Dot, // .

    // Special
    EOF,
}

const KEYWORDS: Record<string, TokenType> = {
    // "let": TokenType.Let, 
    // "var": TokenType.Let,
    "fn": TokenType.Fn,
    "if": TokenType.If,
    "else": TokenType.Else,
    "while": TokenType.While,
    "for": TokenType.For,
    "return": TokenType.Return,
    "end": TokenType.End,
    "and": TokenType.And,
    "or": TokenType.Or,
    "not": TokenType.Not,
    "true": TokenType.Identifier, // Treated as identifier or bool literal? Identifier handled in parser
    "false": TokenType.Identifier,
    "print": TokenType.Print,
    "import": TokenType.Import,
};

export interface Token {
    value: string;
    type: TokenType;
    line: number;
}

export function tokenize(sourceCode: string): Token[] {
    const tokens: Token[] = [];
    const src = sourceCode.split("");
    let line = 1;

    console.log("Tokenizing new syntax...");

    while (src.length > 0) {
        // Handle ()
        if (src[0] == "(") {
            tokens.push({ value: src.shift()!, type: TokenType.OpenParen, line });
        } else if (src[0] == ")") {
            tokens.push({ value: src.shift()!, type: TokenType.CloseParen, line });
        } else if (src[0] == ",") {
            tokens.push({ value: src.shift()!, type: TokenType.Comma, line });
        } else if (src[0] == ".") {
            tokens.push({ value: src.shift()!, type: TokenType.Dot, line });
        }
        // Operators
        else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%") {
            tokens.push({ value: src.shift()!, type: TokenType.BinaryOperator, line });
        } else if (src[0] == "=") {
            // Handle ==
            if (src[1] == "=") {
                src.shift();
                src.shift();
                tokens.push({ value: "==", type: TokenType.Equivalence, line });
            } else {
                tokens.push({ value: src.shift()!, type: TokenType.Equals, line });
            }
        }
        else if (src[0] == ">" || src[0] == "<") {
            // Supports >=, <=
            if (src[1] == "=") {
                const val = src.shift()! + src.shift()!;
                tokens.push({ value: val, type: TokenType.BinaryOperator, line });
            } else {
                // Handles <, >
                // What about strict operator?
                if (src[0] == "<" || src[0] == ">") {
                    tokens.push({ value: src.shift()!, type: TokenType.BinaryOperator, line });
                }
            }
        }
        // Handle ! (Logic Not or Not Equals)
        else if (src[0] == "!") {
            if (src[1] == "=") {
                src.shift(); src.shift();
                tokens.push({ value: "!=", type: TokenType.BinaryOperator, line });
            } else {
                src.shift();
                tokens.push({ value: "!", type: TokenType.Not, line });
            }
        }
        // Handle Strings
        else if (src[0] == '"') {
            src.shift(); // skip opening quote
            let str = "";
            while (src.length > 0 && src[0] != '"') {
                str += src.shift();
            }
            src.shift(); // skip closing quote
            tokens.push({ value: str, type: TokenType.String, line });
        }
        // Handle Numbers
        else if (isInt(src[0])) {
            let num = "";
            while (src.length > 0 && isInt(src[0])) {
                num += src.shift();
            }
            tokens.push({ value: num, type: TokenType.Number, line });
        }
        // Handle Identifiers & Keywords
        else if (isAlpha(src[0])) {
            let ident = "";
            while (src.length > 0 && (isAlpha(src[0]) || isInt(src[0]) || src[0] == "_")) {
                ident += src.shift();
            }
            // Check for keywords
            const reserved = KEYWORDS[ident];
            if (reserved !== undefined) {
                tokens.push({ value: ident, type: reserved, line });
            } else {
                tokens.push({ value: ident, type: TokenType.Identifier, line });
            }
        }
        // Whitespace
        else if (isSkippable(src[0])) {
            if (src[0] == '\n') line++;
            src.shift();
        }
        // Comments
        else if (src[0] == '#') {
            while (src.length > 0 && src[0] as string != '\n') {
                src.shift();
            }
        }
        else {
            throw new Error(`Unrecognized character found in source: ${src[0]}`);
        }
    }

    tokens.push({ value: "EndOfFile", type: TokenType.EOF, line });
    return tokens;
}

function isAlpha(str: string) {
    return str.toUpperCase() != str.toLowerCase();
}

function isSkippable(str: string) {
    return str == " " || str == "\n" || str == "\t" || str == "\r";
}

function isInt(str: string) {
    const c = str.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return c >= bounds[0] && c <= bounds[1];
}
