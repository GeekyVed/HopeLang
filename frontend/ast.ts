//These nodes are actually (child nodes in the syntax tree) represeting diff constructs in src code

export type NodeType =
    //Statements
    | "Program"
    | "VarDeclaration"
    //Expressions
    | "AssignmentExpr"
    | "NumericLiteral"
    | "Identifier"
    | "BinaryExpr"
    | "MemberExpr"
    | "CallExpr"
    //Literals
    | "Property"
    | "ObjectLiteral"; // Object contains property

export interface Stmt {
    kind: NodeType;
}

export interface Program extends Stmt {
    kind: "Program";
    body: Stmt[];
}

export interface VarDeclaration extends Stmt {
    kind: "VarDeclaration";
    constant: boolean;
    identifier: string;
    value?: Expr; // Let x; <- x is not defined here
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

export interface MemberExpr extends Expr {
    kind: "MemberExpr";
    object: Expr;
    property: Expr;
    computed: boolean; 
}

export interface CallExpr extends Expr {
    kind: "CallExpr";
    args: Expr[];
    calle: Expr; //what if foo.bar()
}

export interface AssignmentExpr extends Expr {
    kind: "AssignmentExpr";
    //assigne is not a string so we can implement complex expressions like
    // x = {f : val} ...Object 
    // lab.x = ... Member exp 
    assigne: Expr;
    value: Expr;
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

export interface Property extends Expr {
    kind: "Property";
    key: string;
    value?: Expr;
}

export interface ObjectLiteral extends Expr {
    kind: "ObjectLiteral";
    properties: Property[];
}
