import { EOF } from "dns";
import { Lexer } from "../lexer/Lexer";
import { Parser } from "../parser/Parser";
import { SyntaxBuilder } from "../parser/SyntaxBuilder";
import { SemanticAnalyzer } from "./SemanticAnalyzer";
import { SemanticState, SemanticStateMachine } from "./SemanticStateMachine";
import { Header } from "../parser/FsmSyntax";
import { AnalysisError, AnalysisErrorID } from "./AnalysisError";

describe("SemanticAnalyzer", () => {
  let lexer: Lexer;
  let parser: Parser;
  let builder: SyntaxBuilder;
  let analyzer: SemanticAnalyzer;

  beforeEach(() => {
    builder = new SyntaxBuilder();
    parser = new Parser(builder);
    lexer = new Lexer(parser);
    analyzer = new SemanticAnalyzer();
  });

  const produceAst = (s: string): SemanticStateMachine => {
    lexer.lex(s);
    // overriding for test purposes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (parser as any).handleEvent(EOF, -1, -1);
    return analyzer.analyze(builder.getFsm());
  };

  describe("SemanticErrors", () => {
    describe("HeaderErrors", () => {
      it("should report errors when no headers are present", () => {
        const errors = produceAst("{}").errors;
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.NO_FSM));
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.NO_INITIAL));
      });

      it("should not report errors when actions header is present", () => {
        const errors = produceAst("FSM:f Initial:i {}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.NO_FSM));
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.NO_INITIAL));
      });

      it("should report error when fsm header is missing", () => {
        const errors = produceAst("actions:a Initial:i {}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.NO_INITIAL));
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.NO_FSM));
      });

      it("should report error when initial header is missing", () => {
        const errors = produceAst("Actions:a Fsm:f {}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.NO_FSM));
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.NO_INITIAL));
      });

      it("should not report errors when all headers are present", () => {
        const errors = produceAst("Initial: f Actions:a Fsm:f {}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.NO_INITIAL));
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.NO_FSM));
      });

      it("should report error when unexpected header is present", () => {
        const errors = produceAst("X: x{s - - -}").errors;
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.INVALID_HEADER, new Header("X", "x")));
      });

      it("should report error when duplicate header is present", () => {
        const errors = produceAst("fsm:f fsm:x{s - - -}").errors;
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.EXTRA_HEADER_IGNORED, new Header("fsm", "x")));
      });

      it("should report error when initial state is not defined", () => {
        const errors = produceAst("initial: i {s - - -}").errors;
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.UNDEFINED_STATE, "initial: i"));
      });
    });

    describe("StateErrors", () => {
      test("nullNextStateIsNotUndefined", () => {
        const errors = produceAst("{s - - -}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.UNDEFINED_STATE, null));
      });

      test("undefinedState", () => {
        const errors = produceAst("{s - s2 -}").errors;
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.UNDEFINED_STATE, "s2"));
      });

      test("noUndefinedStates", () => {
        const errors = produceAst("{s - s -}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.UNDEFINED_STATE, "s2"));
      });

      test("undefinedSuperState", () => {
        const errors = produceAst("{s:ss - - -}").errors;
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.UNDEFINED_SUPER_STATE, "ss"));
      });

      test("superStateDefined", () => {
        const errors = produceAst("{ss - - - s:ss - - -}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.UNDEFINED_SUPER_STATE, "s2"));
      });

      test("unusedStates", () => {
        const errors = produceAst("{s e n -}").errors;
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.UNUSED_STATE, "s"));
      });

      test("noUnusedStates", () => {
        const errors = produceAst("{s e s -}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.UNUSED_STATE, "s"));
      });

      test("nextStateNullIsImplicitUse", () => {
        const errors = produceAst("{s e - -}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.UNUSED_STATE, "s"));
      });

      test("usedAsBaseIsValidUsage", () => {
        const errors = produceAst("{b e n - s:b e2 s -}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.UNUSED_STATE, "b"));
      });

      test("usedAsInitialIsValidUsage", () => {
        const errors = produceAst("initial: b {b e n -}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.UNUSED_STATE, "b"));
      });

      test("errorIfSuperStatesHaveConflictingTransitions", () => {
        const errors = produceAst(
          "FSM: f Actions: act Initial: s" +
            "{" +
            "  (ss1) e1 s1 -" +
            "  (ss2) e1 s2 -" +
            "  s :ss1 :ss2 e2 s3 a" +
            "  s2 e s -" +
            "  s1 e s -" +
            "  s3 e s -" +
            "}"
        ).errors;
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.CONFLICTING_SUPERSTATES, "s|e1"));
      });

      test("noErrorForOverriddenTransition", () => {
        const errors = produceAst(
          "FSM: f Actions: act Initial: s" +
            "{" +
            "  (ss1) e1 s1 -" +
            "  s :ss1 e1 s3 a" +
            "  s1 e s -" +
            "  s3 e s -" +
            "}"
        ).errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.CONFLICTING_SUPERSTATES, "s|e1"));
      });

      test("noErrorIfSuperStatesHaveIdenticalTransitions", () => {
        const errors = produceAst(
          "FSM: f Actions: act Initial: s" +
            "{" +
            "  (ss1) e1 s1 ax" +
            "  (ss2) e1 s1 ax" +
            "  s :ss1 :ss2 e2 s3 a" +
            "  s1 e s -" +
            "  s3 e s -" +
            "}"
        ).errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.CONFLICTING_SUPERSTATES, "s|e1"));
      });

      test("errorIfSuperstatesHaveDifferentActionsInSameTransitions", () => {
        const errors = produceAst(
          "FSM: f Actions: act Initial: s" +
            "{" +
            "  (ss1) e1 s1 a1" +
            "  (ss2) e1 s1 a2" +
            "  s :ss1 :ss2 e2 s3 a" +
            "  s1 e s -" +
            "  s3 e s -" +
            "}"
        ).errors;
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.CONFLICTING_SUPERSTATES, "s|e1"));
      });
    });

    describe("StateErrors", () => {
      test("nullNextStateIsNotUndefined", () => {
        const errors = produceAst("{s - - -}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.UNDEFINED_STATE, null));
      });

      test("undefinedState", () => {
        const errors = produceAst("{s - s2 -}").errors;
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.UNDEFINED_STATE, "s2"));
      });

      test("noUndefinedStates", () => {
        const errors = produceAst("{s - s -}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.UNDEFINED_STATE, "s2"));
      });

      test("undefinedSuperState", () => {
        const errors = produceAst("{s:ss - - -}").errors;
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.UNDEFINED_SUPER_STATE, "ss"));
      });

      test("superStateDefined", () => {
        const errors = produceAst("{ss - - - s:ss - - -}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.UNDEFINED_SUPER_STATE, "s2"));
      });

      test("unusedStates", () => {
        const errors = produceAst("{s e n -}").errors;
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.UNUSED_STATE, "s"));
      });

      test("noUnusedStates", () => {
        const errors = produceAst("{s e s -}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.UNUSED_STATE, "s"));
      });

      test("nextStateNullIsImplicitUse", () => {
        const errors = produceAst("{s e - -}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.UNUSED_STATE, "s"));
      });

      test("usedAsBaseIsValidUsage", () => {
        const errors = produceAst("{b e n - s:b e2 s -}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.UNUSED_STATE, "b"));
      });

      test("usedAsInitialIsValidUsage", () => {
        const errors = produceAst("initial: b {b e n -}").errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.UNUSED_STATE, "b"));
      });

      test("errorIfSuperStatesHaveConflictingTransitions", () => {
        const errors = produceAst(
          "FSM: f Actions: act Initial: s" +
            "{" +
            "  (ss1) e1 s1 -" +
            "  (ss2) e1 s2 -" +
            "  s :ss1 :ss2 e2 s3 a" +
            "  s2 e s -" +
            "  s1 e s -" +
            "  s3 e s -" +
            "}"
        ).errors;
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.CONFLICTING_SUPERSTATES, "s|e1"));
      });

      test("noErrorForOverriddenTransition", () => {
        const errors = produceAst(
          "FSM: f Actions: act Initial: s" +
            "{" +
            "  (ss1) e1 s1 -" +
            "  s :ss1 e1 s3 a" +
            "  s1 e s -" +
            "  s3 e s -" +
            "}"
        ).errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.CONFLICTING_SUPERSTATES, "s|e1"));
      });

      test("noErrorIfSuperStatesHaveIdenticalTransitions", () => {
        const errors = produceAst(
          "FSM: f Actions: act Initial: s" +
            "{" +
            "  (ss1) e1 s1 ax" +
            "  (ss2) e1 s1 ax" +
            "  s :ss1 :ss2 e2 s3 a" +
            "  s1 e s -" +
            "  s3 e s -" +
            "}"
        ).errors;
        expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.CONFLICTING_SUPERSTATES, "s|e1"));
      });

      test("errorIfSuperstatesHaveDifferentActionsInSameTransitions", () => {
        const errors = produceAst(
          "FSM: f Actions: act Initial: s" +
            "{" +
            "  (ss1) e1 s1 a1" +
            "  (ss2) e1 s1 a2" +
            "  s :ss1 :ss2 e2 s3 a" +
            "  s1 e s -" +
            "  s3 e s -" +
            "}"
        ).errors;
        expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.CONFLICTING_SUPERSTATES, "s|e1"));
      });
    });
  });

  describe("Warnings", () => {
    test("warnIfStateUsedAsBothAbstractAndConcrete", () => {
      const errors = produceAst("{(ias) e - - ias e - - (cas) e - -}").warnings;
      expect(errors).not.toContainEqual(new AnalysisError(AnalysisErrorID.INCONSISTENT_ABSTRACTION, "cas"));
      expect(errors).toContainEqual(new AnalysisError(AnalysisErrorID.INCONSISTENT_ABSTRACTION, "ias"));
    });
  });

  describe("Lists", () => {
    test("oneState", () => {
      const ast = produceAst("{s - - -}");
      expect(Array.from(ast.states.values())).toContainEqual(new SemanticState("s"));
    });

    test("manyStates", () => {
      const ast = produceAst("{s1 - - - s2 - - - s3 - - -}");
      expect(Array.from(ast.states.values())).toEqual(
        expect.arrayContaining([new SemanticState("s1"), new SemanticState("s2"), new SemanticState("s3")])
      );
    });

    test("statesAreKeyedByName", () => {
      const ast = produceAst("{s1 - - - s2 - - - s3 - - -}");
      expect(ast.states.get("s1")).toEqual(new SemanticState("s1"));
      expect(ast.states.get("s2")).toEqual(new SemanticState("s2"));
      expect(ast.states.get("s3")).toEqual(new SemanticState("s3"));
    });

    test("manyEvents", () => {
      const ast = produceAst("{s1 e1 - - s2 e2 - - s3 e3 - -}");
      const events = Array.from(ast.events.values());
      expect(events).toEqual(expect.arrayContaining(["e1", "e2", "e3"]));
      expect(events).toHaveLength(3);
    });

    test("manyEventsButNoDuplicates", () => {
      const ast = produceAst("{s1 e1 - - s2 e2 - - s3 e1 - -}");
      const events = Array.from(ast.events.values());
      expect(events).toEqual(expect.arrayContaining(["e1", "e2"]));
      expect(events).toHaveLength(2);
    });

    test("noNullEvents", () => {
      const ast = produceAst("{(s1) - - -}");
      const events = Array.from(ast.events.values());
      expect(events).toHaveLength(0);
    });

    test("manyActionsButNoDuplicates", () => {
      const ast = produceAst("{s1 e1 - {a1 a2} s2 e2 - {a3 a1}}");
      const actions = Array.from(ast.actions.values());
      expect(actions).toEqual(expect.arrayContaining(["a1", "a2", "a3"]));
      expect(actions).toHaveLength(3);
    });

    test("entryAndExitActionsAreCountedAsActions", () => {
      const ast = produceAst("{s <ea >xa - - a}");
      const actions = Array.from(ast.actions.values());
      expect(actions).toEqual(expect.arrayContaining(["ea", "xa"]));
    });
  });

  describe("Logic", () => {
    function addHeader(s: string): string {
      return "initial: s fsm:f actions:a " + s;
    }

    function assertSyntaxToAst(syntax: string, expected: string): void {
      const states = produceAst(addHeader(syntax)).statesToString();
      expect(states).toEqual(expected);
    }

    test("oneTransition", () => {
      assertSyntaxToAst(
        "{s e s a}",
        [
          // comment to stop prettier from formatting into a single line to preserve readability of these tests
          "{",
          "  s {",
          "    e s {a}",
          "  }",
          "}",
          "",
        ].join("\n")
      );
    });

    test("twoTransitionsAreAggregated", () => {
      assertSyntaxToAst(
        "{s e1 s a s e2 s a}",
        [
          //
          "{",
          "  s {",
          "    e1 s {a}",
          "    e2 s {a}",
          "  }",
          "}",
          "",
        ].join("\n")
      );
    });

    test("superStatesAreAggregated", () => {
      assertSyntaxToAst(
        "{s:b1 e1 s a s:b2 e2 s a (b1) e s - (b2) e s -}",
        [
          //
          "{",
          "  s :b1 :b2 {",
          "    e1 s {a}",
          "    e2 s {a}",
          "  }",
          "",
          "  (b1) {",
          "    e s {}",
          "  }",
          "",
          "  (b2) {",
          "    e s {}",
          "  }",
          "}",
          "",
        ].join("\n")
      );
    });

    test("nullNextStateRefersToSelf", () => {
      assertSyntaxToAst(
        "{s e - a}",
        [
          //
          "{",
          "  s {",
          "    e s {a}",
          "  }",
          "}",
          "",
        ].join("\n")
      );
    });

    test("actionsRemainInOrder", () => {
      assertSyntaxToAst(
        "{s e s {the quick brown fox jumped over the lazy dogs back}}",
        [
          //
          "{",
          "  s {",
          "    e s {the quick brown fox jumped over the lazy dogs back}",
          "  }",
          "}",
          "",
        ].join("\n")
      );
    });

    test("entryAndExitActionsRemainInOrder", () => {
      assertSyntaxToAst(
        "{s <{d o} <g >{c a} >t e s a}",
        [
          //
          "{",
          "  s <d <o <g >c >a >t {",
          "    e s {a}",
          "  }",
          "}",
          "",
        ].join("\n")
      );
    });
  });

  describe("AcceptanceTests", () => {
    test("subwayTurnstileOne", () => {
      const ast = produceAst(
        "" +
          "Actions: Turnstile\n" +
          "FSM: OneCoinTurnstile\n" +
          "Initial: Locked\n" +
          "{\n" +
          "  Locked\tCoin\tUnlocked\t{alarmOff unlock}\n" +
          "  Locked \tPass\tLocked\t\talarmOn\n" +
          "  Unlocked\tCoin\tUnlocked\tthankyou\n" +
          "  Unlocked\tPass\tLocked\t\tlock\n" +
          "}"
      );
      expect(ast.toString()).toEqual(
        "" +
          "Actions: Turnstile\n" +
          "FSM: OneCoinTurnstile\n" +
          "Initial: Locked\n" +
          "{\n" +
          "  Locked {\n" +
          "    Coin Unlocked {alarmOff unlock}\n" +
          "    Pass Locked {alarmOn}\n" +
          "  }\n" +
          "\n" +
          "  Unlocked {\n" +
          "    Coin Unlocked {thankyou}\n" +
          "    Pass Locked {lock}\n" +
          "  }\n" +
          "}\n"
      );
    });

    test("subwayTurnstileTwo", () => {
      const ast = produceAst(
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
          "}"
      );
      expect(ast.toString()).toEqual(
        "" +
          "Actions: Turnstile\n" +
          "FSM: TwoCoinTurnstile\n" +
          "Initial: Locked\n" +
          "{\n" +
          "  Locked {\n" +
          "    Pass Alarming {alarmOn}\n" +
          "    Coin FirstCoin {}\n" +
          "    Reset Locked {lock alarmOff}\n" +
          "  }\n" +
          "\n" +
          "  Alarming {\n" +
          "    Reset Locked {lock alarmOff}\n" +
          "  }\n" +
          "\n" +
          "  FirstCoin {\n" +
          "    Pass Alarming {}\n" +
          "    Coin Unlocked {unlock}\n" +
          "    Reset Locked {lock alarmOff}\n" +
          "  }\n" +
          "\n" +
          "  Unlocked {\n" +
          "    Pass Locked {lock}\n" +
          "    Coin Unlocked {thankyou}\n" +
          "    Reset Locked {lock alarmOff}\n" +
          "  }\n" +
          "}\n"
      );
    });

    test("subwayTurnstileThree", () => {
      const ast = produceAst(
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
          "}"
      );
      expect(ast.toString()).toEqual(
        "" +
          "Actions: Turnstile\n" +
          "FSM: TwoCoinTurnstile\n" +
          "Initial: Locked\n" +
          "{\n" +
          "  (Base) {\n" +
          "    Reset Locked {lock}\n" +
          "  }\n" +
          "\n" +
          "  Locked :Base {\n" +
          "    Pass Alarming {}\n" +
          "    Coin FirstCoin {}\n" +
          "  }\n" +
          "\n" +
          "  Alarming :Base <alarmOn >alarmOff {\n" +
          "    null Alarming {}\n" +
          "  }\n" +
          "\n" +
          "  FirstCoin :Base {\n" +
          "    Pass Alarming {}\n" +
          "    Coin Unlocked {unlock}\n" +
          "  }\n" +
          "\n" +
          "  Unlocked :Base {\n" +
          "    Pass Locked {lock}\n" +
          "    Coin Unlocked {thankyou}\n" +
          "  }\n" +
          "}\n"
      );
    });
  });
});
