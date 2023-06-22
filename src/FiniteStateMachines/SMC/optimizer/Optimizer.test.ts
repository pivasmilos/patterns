import { EOF } from "dns";
import { Lexer } from "../lexer/Lexer";
import { Parser } from "../parser/Parser";
import { SyntaxBuilder } from "../parser/SyntaxBuilder";
import { SemanticAnalyzer } from "../semanticAnalyzer/SemanticAnalyzer";
import { SemanticStateMachine } from "../semanticAnalyzer/SemanticStateMachine";
import { OptimizedStateMachine } from "./OptimizedStateMachine";
import { Optimizer } from "./Optimizer";
import { compressWhiteSpace } from "../utilities";

describe("Optimizer", () => {
  let lexer: Lexer;
  let parser: Parser;
  let builder: SyntaxBuilder;
  let analyzer: SemanticAnalyzer;
  let optimizer: Optimizer;
  let optimizedStateMachine: OptimizedStateMachine;

  beforeEach(() => {
    builder = new SyntaxBuilder();
    parser = new Parser(builder);
    lexer = new Lexer(parser);
    analyzer = new SemanticAnalyzer();
    optimizer = new Optimizer();
  });

  const produceStateMachineWithHeader = (s: string): OptimizedStateMachine => {
    const fsmSyntax = `fsm:f initial:i actions:a ${s}`;
    return produceStateMachine(fsmSyntax);
  };

  const produceStateMachine = (fsmSyntax: string): OptimizedStateMachine => {
    lexer.lex(fsmSyntax);
    // overriding for test purposes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (parser as any).handleEvent(EOF, -1, -1);
    const ast: SemanticStateMachine = analyzer.analyze(builder.getFsm());
    return optimizer.optimize(ast);
  };

  const assertOptimization = (syntax: string, stateMachine: string) => {
    optimizedStateMachine = produceStateMachineWithHeader(syntax);
    expect(compressWhiteSpace(optimizedStateMachine.transitionsToString())).toEqual(compressWhiteSpace(stateMachine));
  };

  describe("Basic Optimizer Functions", () => {
    it("Header", () => {
      const sm = produceStateMachineWithHeader("{i e i -}");
      expect(sm.header.fsm).toEqual("f");
      expect(sm.header.initial).toEqual("i");
      expect(sm.header.actions).toEqual("a");
    });

    it("States are preserved", () => {
      const sm = produceStateMachineWithHeader("{i e s - s e i -}");
      expect(sm.states).toEqual(["i", "s"]);
    });

    it("Abstract states are removed", () => {
      const sm = produceStateMachineWithHeader("{(b) - - - i:b e i -}");
      expect(sm.states).not.toContain("b");
    });

    it("Events are preserved", () => {
      const sm = produceStateMachineWithHeader("{i e1 s - s e2 i -}");
      expect(sm.events).toEqual(["e1", "e2"]);
    });

    it("Actions are preserved", () => {
      const sm = produceStateMachineWithHeader("{i e1 s a1 s e2 i a2}");
      expect(sm.actions).toEqual(["a1", "a2"]);
    });

    it("Simple state machine", () => {
      assertOptimization(
        "{i e i a1}",
        "" + //
          "i {\n" +
          "  e i {a1}\n" +
          "}\n"
      );
      expect(optimizedStateMachine.transitions).toHaveLength(1);
    });
  });

  describe("Entry and Exit Actions", () => {
    test("entryFunctionsAdded", () => {
      assertOptimization(
        "" + //
          "{" +
          "  i e s a1" +
          "  i e2 s a2" +
          "  s <n1 <n2 e i -" +
          "}",
        "" + //
          "i {\n" +
          "  e s {n1 n2 a1}\n" +
          "  e2 s {n1 n2 a2}\n" +
          "}\n" +
          "s {\n" +
          "  e i {}\n" +
          "}\n"
      );
    });

    test("Exit functions added", () => {
      assertOptimization(
        "" + //
          "{" +
          "  i >x2 >x1 e s a1" +
          "  i e2 s a2" +
          "  s e i -" +
          "}",
        "" + //
          "i {\n" +
          "  e s {x2 x1 a1}\n" +
          "  e2 s {x2 x1 a2}\n" +
          "}\n" +
          "s {\n" +
          "  e i {}\n" +
          "}\n"
      );
    });

    test("First super state entry and exit actions are added", () => {
      assertOptimization(
        "" +
          "{" +
          "  (ib) >ibx1 >ibx2 - - -" +
          "  (sb) <sbn1 <sbn2 - - -" +
          "  i:ib >x e s a" +
          "  s:sb <n e i -" +
          "}",
        "" + //
          "i {\n" +
          "  e s {x ibx1 ibx2 sbn1 sbn2 n a}\n" +
          "}\n" +
          "s {\n" +
          "  e i {}\n" +
          "}\n"
      );
    });

    test("Multiple super state entry and exit actions are added", () => {
      assertOptimization(
        "" +
          "{" +
          "  (ib1) >ib1x - - -" +
          "  (ib2) : ib1 >ib2x - - -" +
          "  (sb1) <sb1n- - -" +
          "  (sb2) :sb1 <sb2n- - -" +
          "  i:ib2 >x e s a" +
          "  s:sb2 <n e i -" +
          "}",
        "" + //
          "i {\n" +
          "  e s {x ib2x ib1x sb1n sb2n n a}\n" +
          "}\n" +
          "s {\n" +
          "  e i {}\n" +
          "}\n"
      );
    });

    test("Diamond super state entry and exit actions are added", () => {
      assertOptimization(
        "" +
          "{" +
          "  (ib1) >ib1x - - -" +
          "  (ib2) : ib1 >ib2x - - -" +
          "  (ib3) : ib1 >ib3x - - -" +
          "  (sb1) <sb1n - - -" +
          "  (sb2) :sb1 <sb2n - - -" +
          "  (sb3) :sb1 <sb3n - - -" +
          "  i:ib2 :ib3 >x e s a" +
          "  s :sb2 :sb3 <n e i -" +
          "}",
        "" + //
          "i {\n" +
          "  e s {x ib3x ib2x ib1x sb1n sb2n sb3n n a}\n" +
          "}\n" +
          "s {\n" +
          "  e i {}\n" +
          "}\n"
      );
    });
  });

  describe("Super state transitions", () => {
    test("Simple inheritance of transitions", () => {
      assertOptimization(
        "" + //
          "{" +
          "  (b) be s ba" +
          "  i:b e s a" +
          "  s e i -" +
          "}",
        "" + //
          "i {\n" +
          "  e s {a}\n" +
          "  be s {ba}\n" +
          "}\n" +
          "s {\n" +
          "  e i {}\n" +
          "}\n"
      );
    });

    test("Deep inheritance of transitions", () => {
      assertOptimization(
        "" + //
          "{" +
          "  (b1) {" +
          "    b1e1 s b1a1" +
          "    b1e2 s b1a2" +
          "  }" +
          "  (b2):b1 b2e s b2a" +
          "  i:b2 e s a" +
          "  s e i -" +
          "}",
        "" + //
          "i {\n" +
          "  e s {a}\n" +
          "  b2e s {b2a}\n" +
          "  b1e1 s {b1a1}\n" +
          "  b1e2 s {b1a2}\n" +
          "}\n" +
          "s {\n" +
          "  e i {}\n" +
          "}\n"
      );
    });

    test("Multiple inheritance of transitions", () => {
      assertOptimization(
        "" + //
          "{" +
          "  (b1) b1e s b1a" +
          "  (b2) b2e s b2a" +
          "  i:b1 :b2 e s a" +
          "  s e i -" +
          "}",
        "" + //
          "i {\n" +
          "  e s {a}\n" +
          "  b2e s {b2a}\n" +
          "  b1e s {b1a}\n" +
          "}\n" +
          "s {\n" +
          "  e i {}\n" +
          "}\n"
      );
    });

    test("Diamond inheritance of transitions", () => {
      assertOptimization(
        "" + //
          "{" +
          "  (b) be s ba" +
          "  (b1):b b1e s b1a" +
          "  (b2):b b2e s b2a" +
          "  i:b1 :b2 e s a" +
          "  s e i -" +
          "}",
        "" + //
          "i {\n" +
          "  e s {a}\n" +
          "  b2e s {b2a}\n" +
          "  b1e s {b1a}\n" +
          "  be s {ba}\n" +
          "}\n" +
          "s {\n" +
          "  e i {}\n" +
          "}\n"
      );
    });

    test("Overriding transitions", () => {
      assertOptimization(
        "" + //
          "{" +
          "  (b) e s2 a2" +
          "  i:b e s a" +
          "  s e i -" +
          "  s2 e i -" +
          "}",
        "" + //
          "i {\n" +
          "  e s {a}\n" +
          "}\n" +
          "s {\n" +
          "  e i {}\n" +
          "}\n" +
          "s2 {\n" +
          "  e i {}\n" +
          "}\n"
      );
    });

    test("Elimination of duplicate transitions", () => {
      assertOptimization(
        "" + "{" + "  (b) e s a" + "  i:b e s a" + "  s e i -" + "}",
        "" + "i {\n" + "  e s {a}\n" + "}\n" + "s {\n" + "  e i {}\n" + "}\n"
      );
    });
  });

  describe("AcceptanceTests", () => {
    test("turnstyle3", () => {
      const sm = produceStateMachine(
        "" + //
          "Actions: Turnstile\n" +
          "FSM: TwoCoinTurnstile\n" +
          "Initial: Locked\n" +
          "{" +
          "    (Base)  Reset  Locked  lock" +
          "" +
          "  Locked : Base {" +
          "    Pass  Alarming  -" +
          "    Coin  FirstCoin -" +
          "  }" +
          "" +
          "  Alarming : Base <alarmOn >alarmOff -  -  -" +
          "" +
          "  FirstCoin : Base {" +
          "    Pass  Alarming  -" +
          "    Coin  Unlocked  unlock" +
          "  }" +
          "" +
          "  Unlocked : Base {" +
          "    Pass  Locked  lock" +
          "    Coin  -       thankyou" +
          "}"
      );
      expect(sm.toString()).toEqual(
        "" + //
          "Initial: Locked\n" +
          "Fsm: TwoCoinTurnstile\n" +
          "Actions:Turnstile\n" +
          "{\n" +
          "  Locked {\n" +
          "    Pass Alarming {alarmOn}\n" +
          "    Coin FirstCoin {}\n" +
          "    Reset Locked {lock}\n" +
          "  }\n" +
          "  Alarming {\n" +
          "    Reset Locked {alarmOff lock}\n" +
          "  }\n" +
          "  FirstCoin {\n" +
          "    Pass Alarming {alarmOn}\n" +
          "    Coin Unlocked {unlock}\n" +
          "    Reset Locked {lock}\n" +
          "  }\n" +
          "  Unlocked {\n" +
          "    Pass Locked {lock}\n" +
          "    Coin Unlocked {thankyou}\n" +
          "    Reset Locked {lock}\n" +
          "  }\n" +
          "}\n"
      );
    });
  });
});
