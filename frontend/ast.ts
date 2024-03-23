//These nodes are actually (child nodes in the syntax tree) represeting diff constructs in src code
export type NodeType =
    | "Program"
    | "NumericLiteral"
    | "Identifier"
    | "BinaryExpr";

export interface Stmt {
    kind: NodeType;
}

export interface Program extends Stmt {
    kind: "Program";
    body: Stmt[];
}

/**  Expressions will result in a value at runtime unlike Statements */
export interface Expr extends Stmt { }

/*
    A operation with two sides seperated by a operator.
    Both sides can be ANY Complex Expression.
    Supported Operators -> + | - | / | * | %
 */
export interface BinaryExpr extends Expr {
    kind: "BinaryExpr";
    left: Expr;
    right: Expr;
    operator: string; // needs to be of type BinaryOperator
}

// LITERAL / PRIMARY EXPRESSION TYPES
// Represents a user-defined variable or symbol in source.
export interface Identifier extends Expr {
    kind: "Identifier";
    symbol: string;
}


//Represents a numeric constant inside the soure code.
export interface NumericLiteral extends Expr {
    kind: "NumericLiteral";
    value: number;
}