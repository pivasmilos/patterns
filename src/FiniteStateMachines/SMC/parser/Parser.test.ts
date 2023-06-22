import { Lexer } from "../lexer/Lexer";
import { compressWhiteSpace } from "../utilities";
import { Parser } from "./Parser";
import { ParserEvent } from "./ParserEvent";
import { SyntaxBuilder } from "./SyntaxBuilder";

describe("Parser", () => {
  let lexer: Lexer;
  let parser: Parser;
  let builder: SyntaxBuilder;

  beforeEach(() => {
    builder = new SyntaxBuilder();
    parser = new Parser(builder);
    lexer = new Lexer(parser);
  });

  function assertParseResult(s: string, expected: string) {
    lexer.lex(s);
    expect(compressWhiteSpace(builder.getFsm().toString())).toEqual(compressWhiteSpace(expected));
  }

  function assertParseError(s: string, expected: string) {
    lexer.lex(s);
    // overriding for test purposes so that we can test the EOF errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (parser as any).handleEvent(ParserEvent.EOF, -1, -1);
    expect(builder.getFsm().getError()).toEqual(expected);
  }

  describe("Incremental tests", () => {
    it("Should parse one header", () => {
      assertParseResult("N:V{}", "N:V\n.\n");
    });

    it("Should parse many headers", () => {
      assertParseResult("  N1 : V1\tN2 : V2\n{}", "N1:V1\nN2:V2\n.\n");
    });

    it("Should handle no header", () => {
      assertParseResult(" {}", ".\n");
    });

    it("Should handle simple transition", () => {
      assertParseResult("{ s e ns a }", "{\n" + "  s e ns a\n" + "}\n" + ".\n");
    });

    it("Should handle transition with null action", () => {
      assertParseResult("{s e ns -}", "{\n" + "  s e ns {}\n" + "}\n" + ".\n");
    });

    it("Should handle transition with many actions", () => {
      assertParseResult("{s e ns {a1 a2}}", "{\n" + "  s e ns {a1 a2}\n" + "}\n" + ".\n");
    });

    it("Should handle state with subtransition", () => {
      assertParseResult("{s {e ns a}}", "{\n" + "  s e ns a\n" + "}\n" + ".\n");
    });

    it("Should handle state with several subtransitions", () => {
      assertParseResult(
        "{s {e1 ns a1 e2 ns a2}}",
        "{\n" + "  s {\n" + "    e1 ns a1\n" + "    e2 ns a2\n" + "  }\n" + "}\n" + ".\n"
      );
    });

    it("Should handle many transitions", () => {
      assertParseResult("{s1 e1 s2 a1 s2 e2 s3 a2}", "{\n" + "  s1 e1 s2 a1\n" + "  s2 e2 s3 a2\n" + "}\n" + ".\n");
    });

    it("Should handle superstate", () => {
      assertParseResult("{(ss) e s a}", "{\n" + "  (ss) e s a\n" + "}\n" + ".\n");
    });

    test("Entry action", () => {
      assertParseResult("{s <ea e ns a}", "{\n  s <ea e ns a\n}\n.\n");
    });

    test("Exit action", () => {
      assertParseResult("{s >xa e ns a}", "{\n  s >xa e ns a\n}\n.\n");
    });

    test("Derived state", () => {
      assertParseResult("{s:ss e ns a}", "{\n  s:ss e ns a\n}\n.\n");
    });

    test("All state adornments", () => {
      assertParseResult("{(s)<ea>xa:ss e ns a}", "{\n  (s):ss <ea >xa e ns a\n}\n.\n");
    });

    test("State with no sub transitions", () => {
      assertParseResult("{s {}}", "{\n  s {\n  }\n}\n.\n");
    });

    test("State with all dashes", () => {
      assertParseResult("{s - - -}", "{\n  s null null {}\n}\n.\n");
    });

    test("Multiple super states", () => {
      assertParseResult("{s :x :y - - -}", "{\n  s:x:y null null {}\n}\n.\n");
    });

    test("Multiple entry actions", () => {
      assertParseResult("{s <x <y - - -}", "{\n  s <x <y null null {}\n}\n.\n");
    });

    test("Multiple exit actions", () => {
      assertParseResult("{s >x >y - - -}", "{\n  s >x >y null null {}\n}\n.\n");
    });

    test("Multiple entry and exit actions with braces", () => {
      assertParseResult("{s <{u v} >{w x} - - -}", "{\n  s <u <v >w >x null null {}\n}\n.\n");
    });
  });

  describe("Acceptance tests", () => {
    test("Simple one coin turnstile", () => {
      assertParseResult(
        "" +
          "Actions: Turnstile\n" +
          "FSM: OneCoinTurnstile\n" +
          "Initial: Locked\n" +
          "{\n" +
          "  Locked\tCoin\tUnlocked\t{alarmOff unlock}\n" +
          "  Locked \tPass\tLocked\t\talarmOn\n" +
          "  Unlocked\tCoin\tUnlocked\tthankyou\n" +
          "  Unlocked\tPass\tLocked\t\tlock\n" +
          "}",
        "" +
          "Actions:Turnstile\n" +
          "FSM:OneCoinTurnstile\n" +
          "Initial:Locked\n" +
          "{\n" +
          "  Locked Coin Unlocked {alarmOff unlock}\n" +
          "  Locked Pass Locked alarmOn\n" +
          "  Unlocked Coin Unlocked thankyou\n" +
          "  Unlocked Pass Locked lock\n" +
          "}\n" +
          ".\n"
      );
    });

    test("Two coin turnstile without super state", () => {
      assertParseResult(
        "" +
          "Actions: Turnstile\n" +
          "FSM: TwoCoinTurnstile\n" +
          "Initial: Locked\n" +
          "{\n" +
          "\tLocked {\n" +
          "\t\tPass\tAlarming\talarmOn\n" +
          "\t\tCoin\tFirstCoin\t-\n" +
          "\t\tReset\tLocked\t{lock alarmOff}\n" +
          "\t}\n" +
          "\t\n" +
          "\tAlarming\tReset\tLocked {lock alarmOff}\n" +
          "\t\n" +
          "\tFirstCoin {\n" +
          "\t\tPass\tAlarming\t-\n" +
          "\t\tCoin\tUnlocked\tunlock\n" +
          "\t\tReset\tLocked {lock alarmOff}\n" +
          "\t}\n" +
          "\t\n" +
          "\tUnlocked {\n" +
          "\t\tPass\tLocked\tlock\n" +
          "\t\tCoin\t-\t\tthankyou\n" +
          "\t\tReset\tLocked {lock alarmOff}\n" +
          "\t}\n" +
          "}",
        "" +
          "Actions:Turnstile\n" +
          "FSM:TwoCoinTurnstile\n" +
          "Initial:Locked\n" +
          "{\n" +
          "  Locked {\n" +
          "    Pass Alarming alarmOn\n" +
          "    Coin FirstCoin {}\n" +
          "    Reset Locked {lock alarmOff}\n" +
          "  }\n" +
          "  Alarming Reset Locked {lock alarmOff}\n" +
          "  FirstCoin {\n" +
          "    Pass Alarming {}\n" +
          "    Coin Unlocked unlock\n" +
          "    Reset Locked {lock alarmOff}\n" +
          "  }\n" +
          "  Unlocked {\n" +
          "    Pass Locked lock\n" +
          "    Coin null thankyou\n" +
          "    Reset Locked {lock alarmOff}\n" +
          "  }\n" +
          "}\n" +
          ".\n"
      );
    });

    test("Two coin turnstile with super state", () => {
      assertParseResult(
        "" +
          "Actions: Turnstile\n" +
          "FSM: TwoCoinTurnstile\n" +
          "Initial: Locked\n" +
          "{\n" +
          "    (Base)\tReset\tLocked\tlock\n" +
          "\n" +
          "\tLocked : Base {\n" +
          "\t\tPass\tAlarming\t-\n" +
          "\t\tCoin\tFirstCoin\t-\n" +
          "\t}\n" +
          "\t\n" +
          "\tAlarming : Base\t<alarmOn >alarmOff -\t-\t-\n" +
          "\t\n" +
          "\tFirstCoin : Base {\n" +
          "\t\tPass\tAlarming\t-\n" +
          "\t\tCoin\tUnlocked\tunlock\n" +
          "\t}\n" +
          "\t\n" +
          "\tUnlocked : Base {\n" +
          "\t\tPass\tLocked\tlock\n" +
          "\t\tCoin\t-\t\tthankyou\n" +
          "\t}\n" +
          "}",
        "" +
          "Actions:Turnstile\n" +
          "FSM:TwoCoinTurnstile\n" +
          "Initial:Locked\n" +
          "{\n" +
          "  (Base) Reset Locked lock\n" +
          "  Locked:Base {\n" +
          "    Pass Alarming {}\n" +
          "    Coin FirstCoin {}\n" +
          "  }\n" +
          "  Alarming:Base <alarmOn >alarmOff null null {}\n" +
          "  FirstCoin:Base {\n" +
          "    Pass Alarming {}\n" +
          "    Coin Unlocked unlock\n" +
          "  }\n" +
          "  Unlocked:Base {\n" +
          "    Pass Locked lock\n" +
          "    Coin null thankyou\n" +
          "  }\n" +
          "}\n" +
          ".\n"
      );
    });
  });

  describe("Error tests", () => {
    test("Parse nothing", () => {
      assertParseError("", "Syntax error: HEADER. HEADER|EOF. line -1, position -1.\n");
    });

    test("Header with no colon or value", () => {
      assertParseError("A {s e ns a}", "Syntax error: HEADER. HEADER_COLON|OPEN_BRACE. line 1, position 2.\n");
    });

    test("Header with no value", () => {
      assertParseError("A: {s e ns a}", "Syntax error: HEADER. HEADER_VALUE|OPEN_BRACE. line 1, position 3.\n");
    });

    test("Transition way too short", () => {
      assertParseError("{s}", "Syntax error: STATE. STATE_MODIFIER|CLOSED_BRACE. line 1, position 2.\n");
    });

    test("Transition too short", () => {
      assertParseError("{s e}", "Syntax error: TRANSITION. SINGLE_EVENT|CLOSED_BRACE. line 1, position 4.\n");
    });

    test("Transition no action", () => {
      assertParseError("{s e ns}", "Syntax error: TRANSITION. SINGLE_NEXT_STATE|CLOSED_BRACE. line 1, position 7.\n");
    });

    test("No closing brace", () => {
      assertParseError("{", "Syntax error: STATE. STATE_SPEC|EOF. line -1, position -1.\n");
    });

    test("Initial state dash", () => {
      assertParseError("{- e ns a}", "Syntax error: STATE. STATE_SPEC|DASH. line 1, position 1.\n");
    });

    test("Lexical error", () => {
      assertParseError("{.}", "Syntax error: SYNTAX. . line 1, position 2.\n");
    });
  });
});
