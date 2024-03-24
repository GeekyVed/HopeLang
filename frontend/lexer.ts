// Taking An Example Line Of Code
// let x = 4 + (hope * lang);
// [LetToken, IdentifierToken, EqualToken, NumberToken ...]

//Defining Type of Tokens
export enum TokenType {
	Number,
	Identifier,
	Let,
	Const,
	SemiColon,
	Comma,
	Colon,
	Dot,
	//
	Equals,
	OpenParen,
	CloseParen,
	OpenBrace,
	CloseBrace,
	OpenBracket,
	CloseBracket,
	BinaryOperator,
	EOF
};

//Defining a Token
export interface Token {
	value: string,
	type: TokenType
}

function token(value = "", type: TokenType): Token {
	return { value, type };
}

//All Reserved Keywords
const KEYWORDS: Record<string, TokenType> = {
	let: TokenType.Let,
	const: TokenType.Const,

};

//Checking Alphabet=> symbol.lC is same as Uc
function isalpha(src: string) {
	return src.toUpperCase() != src.toLowerCase();
}

function isskippable(str: string) {
	return str == " " || str == "\n" || str == "\t" || str == "\r";
}

//Comparing unicodes
function isint(str: string) {
	const c = str.charCodeAt(0);
	const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
	return c >= bounds[0] && c <= bounds[1];
}

//Function to actually tokenize 
export function tokenize(sourceCode: string): Token[] {
	const tokens = new Array<Token>();

	const src = sourceCode.split("");
	while (src.length > 0) {
		if (src[0] == "(") {
			tokens.push(token(src.shift(), TokenType.OpenParen));
		} else if (src[0] == ")") {
			tokens.push(token(src.shift(), TokenType.CloseParen));
		}
		else if (src[0] == "}") {
			tokens.push(token(src.shift(), TokenType.CloseBrace));
		}
		else if (src[0] == "]") {
			tokens.push(token(src.shift(), TokenType.CloseBracket));
		}
		else if (src[0] == "[") {
			tokens.push(token(src.shift(), TokenType.OpenBracket));
		}
		else if (src[0] == "{") {
			tokens.push(token(src.shift(), TokenType.OpenBrace));
		}
		else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%") {
			tokens.push(token(src.shift(), TokenType.BinaryOperator));
		}
		else if (src[0] == "=") {
			tokens.push(token(src.shift(), TokenType.Equals));
		}
		else if (src[0] == ";") {
			tokens.push(token(src.shift(), TokenType.SemiColon));
		}
		else if (src[0] == ":") {
			tokens.push(token(src.shift(), TokenType.Colon));
		}
		else if (src[0] == ",") {
			tokens.push(token(src.shift(), TokenType.Comma));
		}
		else if (src[0] == ".") {
			tokens.push(token(src.shift(), TokenType.Dot));
		}
		// HANDLE MULTICHARACTER KEYWORDS, TOKENS, IDENTIFIERS ETC...
		else {
			if (isint(src[0])) {
				let num = "";
				while (src.length > 0 && isint(src[0])) {
					num += src.shift();
				}

				tokens.push(token(num, TokenType.Number));
			}
			else if (isalpha(src[0])) {
				let ident = "";
				while (src.length > 0 && isalpha(src[0])) {
					ident += src.shift();
				}

				//Reserved Keywords
				const reserved = KEYWORDS[ident];
				// If value is not undefined then the identifier is reconized keyword
				if (typeof reserved == "number") {
					tokens.push(token(ident, reserved));
				} else {
					// Unreconized name must mean user defined symbol.
					tokens.push(token(ident, TokenType.Identifier));
				}
			} else if (isskippable(src[0])) {
				src.shift();
			}
			else {
				console.error(
					"Unreconized character found in source: ",
					src[0].charCodeAt(0),
					src[0]
				);
				Deno.exit(1);
			}
		}
	}
	tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
	return tokens;
}


/* For Running ts file we need a runtime called Deno..
With just a single command its globally installed
also the vscode uses seperate paths so we have to manually enable
Deno in vscode with Ctrl + Shift + P to use Deno and make vscode inherit
the deno's path and also an extension :) */

// Run ts :  deno run -A lexer.ts