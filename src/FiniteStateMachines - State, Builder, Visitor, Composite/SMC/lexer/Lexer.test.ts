import { Lexer } from "./Lexer";
import { TokenCollector } from "./TokenCollector";

describe("Lexer", () => {
  let tokens: string[] = [];
  let collector: TokenCollector;
  let underTest: Lexer;

  function expectLexResult(input: string, expectedOutput: string): void {
    underTest.lex(input);
    expect(getTokensToCompare(tokens)).toEqual(expectedOutput);
  }

  function getTokensToCompare(t: string[]): string {
    return t.join(",");
  }

  beforeEach(() => {
    tokens = [];
    collector = {
      openBrace: jest.fn(() => {
        tokens.push("OB");
      }),
      closedBrace: jest.fn(() => {
        tokens.push("CB");
      }),
      openParen: jest.fn(() => {
        tokens.push("OP");
      }),
      closedParen: jest.fn(() => {
        tokens.push("CP");
      }),
      openAngle: jest.fn(() => {
        tokens.push("OA");
      }),
      closedAngle: jest.fn(() => {
        tokens.push("CA");
      }),
      dash: jest.fn(() => {
        tokens.push("D");
      }),
      colon: jest.fn(() => {
        tokens.push("C");
      }),
      name: jest.fn((name: string) => {
        tokens.push(`#${name}#`);
      }),
      error: jest.fn((line: number, pos: number) => {
        tokens.push(`E${line}:${pos}`);
      }),
      eof: jest.fn(),
    };
    underTest = new Lexer(collector);
  });

  describe("SingleTokenTests", () => {
    it("should find open brace", () => {
      expectLexResult("{", "OB");
    });

    it("should find closed brace", () => {
      expectLexResult("}", "CB");
    });

    it("should find open paren", () => {
      expectLexResult("(", "OP");
    });

    it("should find closed paren", () => {
      expectLexResult(")", "CP");
    });

    it("should find open angle", () => {
      expectLexResult("<", "OA");
    });

    it("should find closed angle", () => {
      expectLexResult(">", "CA");
    });

    it("should find dash", () => {
      expectLexResult("-", "D");
    });

    it("should find colon", () => {
      expectLexResult(":", "C");
    });

    it("should find simple name", () => {
      expectLexResult("name", "#name#");
    });

    it("should find complex name", () => {
      expectLexResult("Room_222", "#Room_222#");
    });

    it("should find error", () => {
      expectLexResult(".", "E1:1");
    });

    it("should ignore whitespace", () => {
      expectLexResult(" ", "");
    });

    it("should ignore whitespace before token", () => {
      expectLexResult("  \t\n  -", "D");
    });
  });

  describe("CommentTests", () => {
    it("should ignore comment after token", () => {
      expectLexResult("-//comment\n", "D");
    });

    it("should ignore comment lines", () => {
      expectLexResult("//comment 1\n-//comment2\n//comment2\n-//comment4;", "D,D");
    });
  });

  describe("MultipleTokenTests", () => {
    it("should lex simple sequence", () => {
      expectLexResult("{}", "OB,CB");
    });

    it("should lex complex sequence", () => {
      expectLexResult("FSM:fsm{this}", "#FSM#,C,#fsm#,OB,#this#,CB");
    });

    it("should lex all tokens", () => {
      expectLexResult("{}()<>-: name .", "OB,CB,OP,CP,OA,CA,D,C,#name#,E1:15");
    });

    it("should lex multiple lines", () => {
      expectLexResult("FSM:fsm.\n{bob-.}", "#FSM#,C,#fsm#,E1:8,OB,#bob#,D,E2:6,CB");
    });
  });
});
