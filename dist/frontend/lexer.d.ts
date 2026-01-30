export declare enum TokenType {
    Number = 0,
    Identifier = 1,
    String = 2,// "Hello"
    Let = 3,// let or var (implicit?) - we'll implement 'var' for explicit 
    Fn = 4,
    If = 5,
    Else = 6,
    While = 7,
    For = 8,
    Return = 9,
    End = 10,// Closes blocks
    Print = 11,// print statement
    Import = 12,// import statement
    And = 13,// &&
    Or = 14,// ||
    Not = 15,// !
    BinaryOperator = 16,// + - * / %
    Equals = 17,// =
    Equivalence = 18,// ==
    OpenParen = 19,// (
    CloseParen = 20,// )
    Comma = 21,// ,
    Dot = 22,// .
    EOF = 23
}
export interface Token {
    value: string;
    type: TokenType;
    line: number;
}
export declare function tokenize(sourceCode: string): Token[];
