"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("./lexer");
class Parser {
    constructor() {
        this.tokens = [];
    }
    not_eof() {
        return this.tokens[0].type != lexer_1.TokenType.EOF;
    }
    at() {
        return this.tokens[0];
    }
    eat() {
        return this.tokens.shift();
    }
    expect(type, err) {
        const prev = this.tokens.shift();
        if (!prev || prev.type != type) {
            console.error("Parser Error:\n", err, prev, " - Expecting: ", type);
            throw new Error(err); // Throw error to standard output
        }
        return prev;
    }
    produceAST(sourceCode) {
        this.tokens = (0, lexer_1.tokenize)(sourceCode);
        const program = {
            kind: "Program",
            body: [],
        };
        // Parse until EOF
        while (this.not_eof()) {
            program.body.push(this.parse_stmt());
        }
        return program;
    }
    parse_stmt() {
        // skip checks
        switch (this.at().type) {
            case lexer_1.TokenType.Let:
            case lexer_1.TokenType.Identifier: // Could be implicit var decl or assignment or fn call
                // We'll peek further in parse_var_decl or assignment
                // Actually, let's distinguishing declarations from assignments
                // if "let" -> decl. if "x = ..." -> implicit decl? we said we support implicit?
                // Let's support "let" explicitly first, and maybe implicit later.
                // Plan said: "Implicit declaration". So "x = 10".
                // But wait, "x = 10" is also assignment to existing.
                // For now, let's treat "x = 10" as VarDeclaration if not declared? 
                // Or just simplify: Ident = Expr is always AssignmentExpr in parsing. 
                // Runtime can handle creation.
                return this.parse_parse_statement_dispatch();
            case lexer_1.TokenType.Fn:
                return this.parse_fn_declaration();
            case lexer_1.TokenType.If:
                return this.parse_if_statement();
            case lexer_1.TokenType.While:
                return this.parse_while_statement();
            case lexer_1.TokenType.Return:
                return this.parse_return_stmt();
            case lexer_1.TokenType.Print:
                return this.parse_print_statement();
            case lexer_1.TokenType.Import:
                return this.parse_import_statement();
            default:
                return this.parse_expr();
        }
    }
    parse_parse_statement_dispatch() {
        if (this.at().type == lexer_1.TokenType.Let) {
            return this.parse_var_declaration();
        }
        // If it starts with identifier, it could be "x = 5" (Assignment) or "foo()" (Call) -> ExprStmt
        // We will parse as expression. 
        // Note: In AST, Assignment is an Expr. So "x=5" is an expression.
        // We accept expressions as statements.
        return this.parse_expr();
    }
    // fn name(args) ... end
    parse_fn_declaration() {
        this.eat(); // eat fn
        const name = this.expect(lexer_1.TokenType.Identifier, "Expected function name following fn keyword").value;
        const declaration = {
            kind: "FunctionDeclaration",
            name,
            parameters: [],
            body: [],
        };
        this.expect(lexer_1.TokenType.OpenParen, "Expected '(' following function name");
        const declarationParams = [];
        if (this.at().type !== lexer_1.TokenType.CloseParen) {
            declarationParams.push(this.expect(lexer_1.TokenType.Identifier, "Expected identifier").value);
            while (this.at().type == lexer_1.TokenType.Comma) {
                this.eat();
                declarationParams.push(this.expect(lexer_1.TokenType.Identifier, "Expected identifier").value);
            }
        }
        this.expect(lexer_1.TokenType.CloseParen, "Expected ')' following function parameters");
        declaration.parameters = declarationParams;
        // Parse Body until "end"
        while (this.at().type !== lexer_1.TokenType.End && this.at().type !== lexer_1.TokenType.EOF) {
            declaration.body.push(this.parse_stmt());
        }
        this.expect(lexer_1.TokenType.End, "Expected 'end' following function body");
        return declaration;
    }
    parse_if_statement() {
        this.eat(); // if
        const condition = this.parse_expr();
        const body = [];
        while (this.at().type !== lexer_1.TokenType.End && this.at().type !== lexer_1.TokenType.Else && this.at().type !== lexer_1.TokenType.EOF) {
            body.push(this.parse_stmt());
        }
        const ifStmt = {
            kind: "IfStatement",
            condition,
            body,
        };
        if (this.at().type == lexer_1.TokenType.Else) {
            this.eat();
            const elseBody = [];
            while (this.at().type !== lexer_1.TokenType.End && this.at().type !== lexer_1.TokenType.EOF) {
                elseBody.push(this.parse_stmt());
            }
            ifStmt.elseBody = elseBody;
        }
        this.expect(lexer_1.TokenType.End, "Expected 'end' following if statement");
        return ifStmt;
    }
    parse_while_statement() {
        this.eat(); // while
        const condition = this.parse_expr();
        const body = [];
        while (this.at().type !== lexer_1.TokenType.End && this.at().type !== lexer_1.TokenType.EOF) {
            body.push(this.parse_stmt());
        }
        this.expect(lexer_1.TokenType.End, "Expected 'end' following while loop");
        return {
            kind: "WhileStatement",
            condition,
            body,
        };
    }
    parse_print_statement() {
        this.eat(); // eat print
        const args = [];
        // Allow print empty? "print" -> newline?
        if (this.at().type !== lexer_1.TokenType.End && this.at().type !== lexer_1.TokenType.EOF) {
            // Parse first arg
            args.push(this.parse_assignment_expr());
            while (this.at().type == lexer_1.TokenType.Comma && this.eat()) {
                args.push(this.parse_assignment_expr());
            }
        }
        // Construct CallExpr
        return {
            kind: "CallExpr",
            caller: { kind: "Identifier", symbol: "print" },
            args,
        };
    }
    parse_import_statement() {
        this.eat(); // eat import
        const moduleName = this.expect(lexer_1.TokenType.String, "Expected string after import").value;
        return {
            kind: "ImportStatement",
            moduleName,
        };
    }
    parse_return_stmt() {
        this.eat(); // eat return
        const value = this.parse_expr();
        return {
            kind: "ReturnStatement",
            value,
        };
    }
    parse_var_declaration() {
        this.eat(); // eat let
        const identifier = this.expect(lexer_1.TokenType.Identifier, "Expected identifier name following let | var keyword.").value;
        if (this.at().type == lexer_1.TokenType.Equals) {
            this.eat(); // eat =
            const value = this.parse_expr();
            return {
                kind: "VarDeclaration",
                identifier,
                value,
                constant: false,
            };
        }
        return {
            kind: "VarDeclaration",
            identifier,
            constant: false,
        };
    }
    parse_expr() {
        return this.parse_assignment_expr();
    }
    parse_assignment_expr() {
        const left = this.parse_object_expr();
        if (this.at().type == lexer_1.TokenType.Equals) {
            this.eat();
            const value = this.parse_assignment_expr();
            return { value, assigne: left, kind: "AssignmentExpr" };
        }
        return left;
    }
    parse_object_expr() {
        return this.parse_equality_expr();
    }
    parse_equality_expr() {
        let left = this.parse_relational_expr();
        while (this.at().value == "==" || this.at().value == "!=" || this.at().type == lexer_1.TokenType.Equivalence) {
            const operator = this.eat().value;
            const right = this.parse_relational_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            };
        }
        return left;
    }
    parse_relational_expr() {
        let left = this.parse_additive_expr();
        while (this.at().value == "<" || this.at().value == ">" || this.at().value == "<=" || this.at().value == ">=") {
            const operator = this.eat().value;
            const right = this.parse_additive_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            };
        }
        return left;
    }
    parse_additive_expr() {
        let left = this.parse_multiplicative_expr();
        while (this.at().value == "+" || this.at().value == "-") {
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            };
        }
        return left;
    }
    parse_multiplicative_expr() {
        let left = this.parse_call_member_expr();
        while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
            const operator = this.eat().value;
            const right = this.parse_call_member_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            };
        }
        return left;
    }
    parse_call_member_expr() {
        const member = this.parse_member_expr();
        if (this.at().type == lexer_1.TokenType.OpenParen) {
            return this.parse_call_expr(member);
        }
        return member;
    }
    parse_call_expr(caller) {
        let call_expr = {
            kind: "CallExpr",
            caller,
            args: this.parse_args(),
        };
        if (this.at().type == lexer_1.TokenType.OpenParen) {
            call_expr = this.parse_call_expr(call_expr);
        }
        return call_expr;
    }
    parse_args() {
        this.expect(lexer_1.TokenType.OpenParen, "Expected open parenthesis");
        const args = this.at().type == lexer_1.TokenType.CloseParen
            ? []
            : this.parse_arguments_list();
        this.expect(lexer_1.TokenType.CloseParen, "Missing closing parenthesis inside arguments list");
        return args;
    }
    parse_arguments_list() {
        const args = [this.parse_assignment_expr()];
        while (this.at().type == lexer_1.TokenType.Comma && this.eat()) {
            args.push(this.parse_assignment_expr());
        }
        return args;
    }
    parse_member_expr() {
        let object = this.parse_primary_expr();
        while (this.at().type == lexer_1.TokenType.Dot || this.at().type == lexer_1.TokenType.OpenParen) {
            // OpenParen handled in CallExpr? No, that's above.
            // Here we handle property access .
            if (this.at().type == lexer_1.TokenType.Dot) {
                this.eat();
                const property = this.parse_primary_expr();
                if (property.kind != "Identifier") {
                    throw new Error("Cannot use dot operator without right hand side being a identifier");
                }
                object = {
                    kind: "MemberExpr",
                    object,
                    property,
                    computed: false,
                };
            }
            else {
                // return object -> break to let call_expr handle it
                break;
            }
        }
        return object;
    }
    parse_primary_expr() {
        const tk = this.at();
        switch (tk.type) {
            case lexer_1.TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value };
            case lexer_1.TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value) };
            case lexer_1.TokenType.String:
                return { kind: "StringLiteral", value: this.eat().value };
            case lexer_1.TokenType.OpenParen:
                this.eat();
                const value = this.parse_expr();
                this.expect(lexer_1.TokenType.CloseParen, "Unexpected token found inside parenthesised expression. Expected closing parenthesis.");
                return value;
            default:
                console.error("Unexpected token found during parsing!", this.at());
                throw new Error("Unexpected token found during parsing!: " + JSON.stringify(this.at()));
        }
    }
}
exports.default = Parser;
