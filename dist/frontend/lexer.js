"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = void 0;
exports.tokenize = tokenize;
// TokenType.ts
var TokenType;
(function (TokenType) {
    // Literal Types
    TokenType[TokenType["Number"] = 0] = "Number";
    TokenType[TokenType["Identifier"] = 1] = "Identifier";
    TokenType[TokenType["String"] = 2] = "String";
    // Keywords
    TokenType[TokenType["Let"] = 3] = "Let";
    TokenType[TokenType["Fn"] = 4] = "Fn";
    TokenType[TokenType["If"] = 5] = "If";
    TokenType[TokenType["Else"] = 6] = "Else";
    TokenType[TokenType["While"] = 7] = "While";
    TokenType[TokenType["For"] = 8] = "For";
    TokenType[TokenType["Return"] = 9] = "Return";
    TokenType[TokenType["End"] = 10] = "End";
    TokenType[TokenType["Print"] = 11] = "Print";
    TokenType[TokenType["Import"] = 12] = "Import";
    // English Operators
    TokenType[TokenType["And"] = 13] = "And";
    TokenType[TokenType["Or"] = 14] = "Or";
    TokenType[TokenType["Not"] = 15] = "Not";
    // Grouping * Operators
    TokenType[TokenType["BinaryOperator"] = 16] = "BinaryOperator";
    TokenType[TokenType["Equals"] = 17] = "Equals";
    TokenType[TokenType["Equivalence"] = 18] = "Equivalence";
    TokenType[TokenType["OpenParen"] = 19] = "OpenParen";
    TokenType[TokenType["CloseParen"] = 20] = "CloseParen";
    TokenType[TokenType["Comma"] = 21] = "Comma";
    TokenType[TokenType["Dot"] = 22] = "Dot";
    // Special
    TokenType[TokenType["EOF"] = 23] = "EOF";
})(TokenType || (exports.TokenType = TokenType = {}));
const KEYWORDS = {
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
function tokenize(sourceCode) {
    const tokens = [];
    const src = sourceCode.split("");
    let line = 1;
    console.log("Tokenizing new syntax...");
    while (src.length > 0) {
        // Handle ()
        if (src[0] == "(") {
            tokens.push({ value: src.shift(), type: TokenType.OpenParen, line });
        }
        else if (src[0] == ")") {
            tokens.push({ value: src.shift(), type: TokenType.CloseParen, line });
        }
        else if (src[0] == ",") {
            tokens.push({ value: src.shift(), type: TokenType.Comma, line });
        }
        else if (src[0] == ".") {
            tokens.push({ value: src.shift(), type: TokenType.Dot, line });
        }
        // Operators
        else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%") {
            tokens.push({ value: src.shift(), type: TokenType.BinaryOperator, line });
        }
        else if (src[0] == "=") {
            // Handle ==
            if (src[1] == "=") {
                src.shift();
                src.shift();
                tokens.push({ value: "==", type: TokenType.Equivalence, line });
            }
            else {
                tokens.push({ value: src.shift(), type: TokenType.Equals, line });
            }
        }
        else if (src[0] == ">" || src[0] == "<") {
            // Supports >=, <=
            if (src[1] == "=") {
                const val = src.shift() + src.shift();
                tokens.push({ value: val, type: TokenType.BinaryOperator, line });
            }
            else {
                // Handles <, >
                // What about strict operator?
                if (src[0] == "<" || src[0] == ">") {
                    tokens.push({ value: src.shift(), type: TokenType.BinaryOperator, line });
                }
            }
        }
        // Handle ! (Logic Not or Not Equals)
        else if (src[0] == "!") {
            if (src[1] == "=") {
                src.shift();
                src.shift();
                tokens.push({ value: "!=", type: TokenType.BinaryOperator, line });
            }
            else {
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
            }
            else {
                tokens.push({ value: ident, type: TokenType.Identifier, line });
            }
        }
        // Whitespace
        else if (isSkippable(src[0])) {
            if (src[0] == '\n')
                line++;
            src.shift();
        }
        // Comments
        else if (src[0] == '#') {
            while (src.length > 0 && src[0] != '\n') {
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
function isAlpha(str) {
    return str.toUpperCase() != str.toLowerCase();
}
function isSkippable(str) {
    return str == " " || str == "\n" || str == "\t" || str == "\r";
}
function isInt(str) {
    const c = str.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return c >= bounds[0] && c <= bounds[1];
}
