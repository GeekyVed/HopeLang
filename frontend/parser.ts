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
    Property,
    ObjectLiteral,
    CallExpr,
    MemberExpr,
    AssignmentExpr,
    FunctionDeclaration
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
            case TokenType.Fn:
                return this.parse_fn_declaration();

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

    parse_fn_declaration(): Stmt {
		this.eat(); // eat fn keyword
		const name = this.expect(
			TokenType.Identifier,
			"Expected function name following fn keyword"
		).value;

		const args = this.parse_args();
		const params: string[] = []; //Double Check its a String
		for (const arg of args) {
			if (arg.kind !== "Identifier") {
				console.log(arg);
				throw "Inside function declaration expected parameters to be of type string.";
			}

			params.push((arg as Identifier).symbol);
		}

		this.expect(
			TokenType.OpenBrace,
			"Expected function body following declaration"
		);
		const body: Stmt[] = [];

		while (
			this.at().type !== TokenType.EOF &&
			this.at().type !== TokenType.CloseBrace
		) {
			body.push(this.parse_stmt());
		}

		this.expect(
			TokenType.CloseBrace,
			"Closing brace expected inside function declaration"
		);

		const fn = {
			body,
			name,
			parameters: params,
			kind: "FunctionDeclaration",
		} as FunctionDeclaration;

		return fn;
	}

    private parse_assignment_expr(): Expr {
        const left = this.parse_object_expr(); // switch this out with objectExpr

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

    private parse_object_expr(): Expr {
        // { Prop[] }
        if (this.at().type !== TokenType.OpenBrace) {
            return this.parse_additive_expr();
        }

        this.eat(); // advance past open brace.
        const properties = new Array<Property>();

        while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
            // {key1 : val , key2...}
            const key =
                this.expect(TokenType.Identifier, "Object literal key exprected").value;

            // Allows shorthand key: pair -> { key, }
            if (this.at().type == TokenType.Comma) {
                this.eat(); // advance past comma
                properties.push({ key, kind: "Property" } as Property);
                continue;
            }
            // Allows shorthand key: pair -> { key }
            else if (this.at().type == TokenType.CloseBrace) {
                properties.push({ key, kind: "Property" });
                continue;
            }

            // { key: val }
            this.expect(
                TokenType.Colon,
                "Missing colon following identifier in ObjectExpr",
            );
            const value = this.parse_expr();

            properties.push({ kind: "Property", value, key });
            if (this.at().type != TokenType.CloseBrace) {
                this.expect(
                    TokenType.Comma,
                    "Expected comma or closing bracket following property",
                );
            }
        }

        this.expect(TokenType.CloseBrace, "Object literal missing closing brace.");
        return { kind: "ObjectLiteral", properties } as ObjectLiteral;
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
        let left = this.parse_call_member_expr();

        while (
            this.at().value == "/" || this.at().value == "*" || this.at().value == "%"
        ) {
            const operator = this.eat().value;
            const right = this.parse_call_member_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    // foo.x()()
    private parse_call_member_expr(): Expr {
        const member = this.parse_member_expr(); // Handles foo.x part

        if (this.at().type == TokenType.OpenParen) {
            return this.parse_call_expr(member); //Handle ()
        }

        return member;
    }

    private parse_call_expr(caller: Expr): Expr {
        let call_expr: Expr = {
            kind: "CallExpr",
            calle: caller,
            args: this.parse_args(),
        } as CallExpr;

        if (this.at().type == TokenType.OpenParen) {   //if we encounter double ()()
            call_expr = this.parse_call_expr(call_expr);
        }

        return call_expr;
    }

    private parse_args(): Expr[] {
        this.expect(TokenType.OpenParen, "Expected open parenthesis");
        const args = this.at().type == TokenType.CloseParen
            ? []
            : this.parse_arguments_list();

        this.expect(
            TokenType.CloseParen,
            "Missing closing parenthesis inside arguments list",
        );
        return args;
    }

    //handle foo(x+5, y)
    private parse_arguments_list(): Expr[] {
        const args = [this.parse_assignment_expr()];

        while (this.at().type == TokenType.Comma && this.eat()) {
            args.push(this.parse_assignment_expr());
        }

        return args;
    }

    private parse_member_expr(): Expr {
        let object = this.parse_primary_expr();

        while (
            this.at().type == TokenType.Dot || this.at().type == TokenType.OpenBracket
        ) {
            const operator = this.eat();
            let property: Expr;
            let computed: boolean;

            // non-computed values aka obj.expr
            if (operator.type == TokenType.Dot) {
                computed = false;
                // get identifier
                property = this.parse_primary_expr();
                if (property.kind != "Identifier") {
                    throw `Cannot use dot operator without right hand side being a identifier`;
                }
            } else { // this allows obj[computedValue]
                computed = true;
                property = this.parse_expr();
                this.expect(
                    TokenType.CloseBracket,
                    "Missing closing bracket in computed value.",
                );
            }

            object = {
                kind: "MemberExpr",
                object,
                property,
                computed,
            } as MemberExpr;
        }

        return object;
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