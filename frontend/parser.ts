// deno-lint-ignore-file no-explicit-any
// https://astexplorer.net/ > test out different parsers...how they work

import {
    BinaryExpr,
    Expr,
    Identifier,
    NumericLiteral,
    Program,
    VarDeclaration,
    Stmt,
    AssignmentExpr
} from "./ast.ts";

import { Token, tokenize, TokenType } from "./lexer.ts";

export default class Parser {
    private tokens: Token[] = [];

    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private at() {
        return this.tokens[0] as Token;
    }

    // Returns the previous token and then advances the tokens array to the next value.
    private eat() {
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    private expect(type: TokenType, err: any) {
        const prev = this.tokens.shift() as Token;
        if (!prev || prev.type != type) {
            console.error("Parser Error:\n", err, prev, " - Expecting: ", type);
            Deno.exit(1);
        }
        return prev;
    }

    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);
        const program: Program = {
            kind: "Program",
            body: [],
        };

        // Parse until end of file
        while (this.not_eof()) {
            program.body.push(this.parse_stmt());
        }

        return program;
    }

    // Handle statement types
    private parse_stmt(): Stmt {
        // skip to parse_expr
        switch (this.at().type) {
            case TokenType.Let:
            case TokenType.Const:
                return this.parse_var_declaration();

            default:
                return this.parse_expr();
        }
    }

    // LET IDENT;
    // ( LET | CONST ) IDENT = EXPR;
    parse_var_declaration(): Stmt {
        const isConstant = this.eat().type == TokenType.Const;
        const identifier = this.expect(
            TokenType.Identifier,
            "Expected identifier name following let | const keywords.",
        ).value;

        if (this.at().type == TokenType.SemiColon) {
            this.eat(); // expect semicolon
            if (isConstant) {
                throw "Must assigne value to constant expression. No value provided.";
            }

            return {
                kind: "VarDeclaration",
                identifier,
                constant: false,
            } as VarDeclaration;
        }

        this.expect(
            TokenType.Equals,
            "Expected equals token following identifier in var declaration.",
        );

        const declaration = {
            kind: "VarDeclaration",
            value: this.parse_expr(),
            identifier,
            constant: isConstant,
        } as VarDeclaration;

        this.expect(
            TokenType.SemiColon,
            "Variable declaration statment must end with semicolon.",
        );

        return declaration;
    }

    // Handle expressions
    private parse_expr(): Expr {
        return this.parse_assignment_expr();
    }

    parse_assignment_expr(): Expr {
        const left = this.parse_additive_expr(); // switch this out with objectExpr

        if (this.at().type == TokenType.Equals) {
            this.eat(); // advance past equals
            const value = this.parse_assignment_expr(); //Allow assignment chaining a = b = c
            return { value, assigne: left, kind: "AssignmentExpr" } as AssignmentExpr;
        }

        // To Check semicolon at end of assignment exp :)
        // if (this.at().type != TokenType.SemiColon) {
        //     throw "Expected semicolon at the end of assignment expression.";
        // }

        return left;
    }

    // Handle Addition & Subtraction Operations
    private parse_additive_expr(): Expr {
        let left = this.parse_multiplicitave_expr();

        while (this.at().value == "+" || this.at().value == "-") {
            const operator = this.eat().value;
            const right = this.parse_multiplicitave_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    // Handle Multiplication, Division & Modulo Operations
    private parse_multiplicitave_expr(): Expr {
        let left = this.parse_primary_expr();

        while (
            this.at().value == "/" || this.at().value == "*" || this.at().value == "%"
        ) {
            const operator = this.eat().value;
            const right = this.parse_primary_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parse_primary_expr(): Expr {
        const tk = this.at().type;

        // Determine which token we are currently at and return literal value
        switch (tk) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier;

            case TokenType.Number:
                return {
                    kind: "NumericLiteral",
                    value: parseFloat(this.eat().value),
                } as NumericLiteral;

            case TokenType.OpenParen: {
                this.eat(); // eat the opening paren
                const value = this.parse_expr();
                this.expect(
                    TokenType.CloseParen,
                    "Unexpected token found inside parenthesised expression. Expected closing parenthesis.",
                ); // closing paren
                return value;
            }

            // Unidentified Tokens and Invalid Code Reached
            default:
                console.error("Unexpected token found during parsing!", this.at());
                Deno.exit(1);
        }
    }

}



// We call the parse_..._ functions inside one another this acually is to define a precedence
// Among different components

// the component with highest priority is actually called at last

// Order of Precendence
// AssigmentExpr
// MemberExpr
// FunctionCall
// LogicalExp
// ComparisonExpr
// AdditiveExpr
// MultiplicativeExpr
// UnaryExpr
// PrimayExp