
import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, VarDeclaration, AssignmentExpr, Property, ObjectLiteral, CallExpr, MemberExpr, FunctionDeclaration, IfStatement, WhileStatement, StringLiteral, ReturnStatement, ImportStatement } from "./ast";
import { tokenize, Token, TokenType } from "./lexer";

export default class Parser {
    private tokens: Token[] = [];

    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private at(): Token {
        return this.tokens[0];
    }

    private eat(): Token {
        return this.tokens.shift() as Token;
    }

    private expect(type: TokenType, err: any): Token {
        const prev = this.tokens.shift() as Token;
        if (!prev || prev.type != type) {
            console.error("Parser Error:\n", err, prev, " - Expecting: ", type);
            throw new Error(err); // Throw error to standard output
        }
        return prev;
    }

    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);
        const program: Program = {
            kind: "Program",
            body: [],
        };

        // Parse until EOF
        while (this.not_eof()) {
            program.body.push(this.parse_stmt());
        }

        return program;
    }

    private parse_stmt(): Stmt {
        // skip checks
        switch (this.at().type) {
            case TokenType.Let:
            case TokenType.Identifier: // Could be implicit var decl or assignment or fn call
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
            case TokenType.Fn:
                return this.parse_fn_declaration();
            case TokenType.If:
                return this.parse_if_statement();
            case TokenType.While:
                return this.parse_while_statement();
            case TokenType.Return:
                return this.parse_return_stmt();
            case TokenType.Print:
                return this.parse_print_statement();
            case TokenType.Import:
                return this.parse_import_statement();
            default:
                return this.parse_expr();
        }
    }

    private parse_parse_statement_dispatch(): Stmt {
        if (this.at().type == TokenType.Let) {
            return this.parse_var_declaration();
        }
        // If it starts with identifier, it could be "x = 5" (Assignment) or "foo()" (Call) -> ExprStmt
        // We will parse as expression. 
        // Note: In AST, Assignment is an Expr. So "x=5" is an expression.
        // We accept expressions as statements.
        return this.parse_expr();
    }

    // fn name(args) ... end
    private parse_fn_declaration(): Stmt {
        this.eat(); // eat fn
        const name = this.expect(TokenType.Identifier, "Expected function name following fn keyword").value;

        const declaration = {
            kind: "FunctionDeclaration",
            name,
            parameters: [],
            body: [],
        } as FunctionDeclaration;

        this.expect(TokenType.OpenParen, "Expected '(' following function name");
        const declarationParams: string[] = [];
        if (this.at().type !== TokenType.CloseParen) {
            declarationParams.push(this.expect(TokenType.Identifier, "Expected identifier").value);
            while (this.at().type == TokenType.Comma) {
                this.eat();
                declarationParams.push(this.expect(TokenType.Identifier, "Expected identifier").value);
            }
        }
        this.expect(TokenType.CloseParen, "Expected ')' following function parameters");
        declaration.parameters = declarationParams;

        // Parse Body until "end"
        while (this.at().type !== TokenType.End && this.at().type !== TokenType.EOF) {
            declaration.body.push(this.parse_stmt());
        }

        this.expect(TokenType.End, "Expected 'end' following function body");
        return declaration;
    }

    private parse_if_statement(): Stmt {
        this.eat(); // if
        const condition = this.parse_expr();
        const body: Stmt[] = [];
        while (this.at().type !== TokenType.End && this.at().type !== TokenType.Else && this.at().type !== TokenType.EOF) {
            body.push(this.parse_stmt());
        }

        const ifStmt = {
            kind: "IfStatement",
            condition,
            body,
        } as IfStatement;

        if (this.at().type == TokenType.Else) {
            this.eat();
            const elseBody: Stmt[] = [];
            while (this.at().type !== TokenType.End && this.at().type !== TokenType.EOF) {
                elseBody.push(this.parse_stmt());
            }
            ifStmt.elseBody = elseBody;
        }

        this.expect(TokenType.End, "Expected 'end' following if statement");
        return ifStmt;
    }

    private parse_while_statement(): Stmt {
        this.eat(); // while
        const condition = this.parse_expr();
        const body: Stmt[] = [];

        while (this.at().type !== TokenType.End && this.at().type !== TokenType.EOF) {
            body.push(this.parse_stmt());
        }

        this.expect(TokenType.End, "Expected 'end' following while loop");

        return {
            kind: "WhileStatement",
            condition,
            body,
        } as WhileStatement;
    }

    private parse_print_statement(): Stmt {
        this.eat(); // eat print

        const args: Expr[] = [];
        // Allow print empty? "print" -> newline?
        if (this.at().type !== TokenType.End && this.at().type !== TokenType.EOF) {
            // Parse first arg
            args.push(this.parse_assignment_expr());
            while (this.at().type == TokenType.Comma && this.eat()) {
                args.push(this.parse_assignment_expr());
            }
        }

        // Construct CallExpr
        return {
            kind: "CallExpr",
            caller: { kind: "Identifier", symbol: "print" } as Identifier,
            args,
        } as CallExpr;
    }

    private parse_import_statement(): Stmt {
        this.eat(); // eat import
        const moduleName = this.expect(TokenType.String, "Expected string after import").value;

        return {
            kind: "ImportStatement",
            moduleName,
        } as ImportStatement;
    }

    private parse_return_stmt(): Stmt {
        this.eat(); // eat return
        const value = this.parse_expr();
        return {
            kind: "ReturnStatement",
            value,
        } as ReturnStatement;
    }

    private parse_var_declaration(): Stmt {
        this.eat(); // eat let
        const identifier = this.expect(TokenType.Identifier, "Expected identifier name following let | var keyword.").value;

        if (this.at().type == TokenType.Equals) {
            this.eat(); // eat =
            const value = this.parse_expr();
            return {
                kind: "VarDeclaration",
                identifier,
                value,
                constant: false,
            } as VarDeclaration;
        }

        return {
            kind: "VarDeclaration",
            identifier,
            constant: false,
        } as VarDeclaration;
    }


    private parse_expr(): Expr {
        return this.parse_assignment_expr();
    }

    private parse_assignment_expr(): Expr {
        const left = this.parse_object_expr();

        if (this.at().type == TokenType.Equals) {
            this.eat();
            const value = this.parse_assignment_expr();
            return { value, assigne: left, kind: "AssignmentExpr" } as AssignmentExpr;
        }

        return left;
    }

    private parse_object_expr(): Expr {
        return this.parse_equality_expr();
    }

    private parse_equality_expr(): Expr {
        let left = this.parse_relational_expr();

        while (this.at().value == "==" || this.at().value == "!=" || this.at().type == TokenType.Equivalence) {
            const operator = this.eat().value;
            const right = this.parse_relational_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parse_relational_expr(): Expr {
        let left = this.parse_additive_expr();

        while (this.at().value == "<" || this.at().value == ">" || this.at().value == "<=" || this.at().value == ">=") {
            const operator = this.eat().value;
            const right = this.parse_additive_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parse_additive_expr(): Expr {
        let left = this.parse_multiplicative_expr();

        while (this.at().value == "+" || this.at().value == "-") {
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parse_multiplicative_expr(): Expr {
        let left = this.parse_call_member_expr();

        while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
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

    private parse_call_member_expr(): Expr {
        const member = this.parse_member_expr();

        if (this.at().type == TokenType.OpenParen) {
            return this.parse_call_expr(member);
        }

        return member;
    }

    private parse_call_expr(caller: Expr): Expr {
        let call_expr: Expr = {
            kind: "CallExpr",
            caller,
            args: this.parse_args(),
        } as CallExpr;

        if (this.at().type == TokenType.OpenParen) {
            call_expr = this.parse_call_expr(call_expr);
        }

        return call_expr;
    }

    private parse_args(): Expr[] {
        this.expect(TokenType.OpenParen, "Expected open parenthesis");
        const args = this.at().type == TokenType.CloseParen
            ? []
            : this.parse_arguments_list();

        this.expect(TokenType.CloseParen, "Missing closing parenthesis inside arguments list");
        return args;
    }

    private parse_arguments_list(): Expr[] {
        const args = [this.parse_assignment_expr()];

        while (this.at().type == TokenType.Comma && this.eat()) {
            args.push(this.parse_assignment_expr());
        }

        return args;
    }

    private parse_member_expr(): Expr {
        let object = this.parse_primary_expr();

        while (this.at().type == TokenType.Dot || this.at().type == TokenType.OpenParen) {
            // OpenParen handled in CallExpr? No, that's above.
            // Here we handle property access .
            if (this.at().type == TokenType.Dot) {
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
                } as MemberExpr;
            } else {
                // return object -> break to let call_expr handle it
                break;
            }
        }

        return object;
    }

    private parse_primary_expr(): Expr {
        const tk = this.at();

        switch (tk.type) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier;
            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral;
            case TokenType.String:
                return { kind: "StringLiteral", value: this.eat().value } as StringLiteral;
            case TokenType.OpenParen:
                this.eat();
                const value = this.parse_expr();
                this.expect(TokenType.CloseParen, "Unexpected token found inside parenthesised expression. Expected closing parenthesis.");
                return value;
            default:
                console.error("Unexpected token found during parsing!", this.at());
                throw new Error("Unexpected token found during parsing!: " + JSON.stringify(this.at()));
        }
    }
}
