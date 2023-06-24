import { NSCGenerator } from "../generators/nestedSwitchCaseGenerator/NSCGenerator";
import { Lexer } from "../lexer/Lexer";
import { OptimizedStateMachine } from "../optimizer/OptimizedStateMachine";
import { Optimizer } from "../optimizer/Optimizer";
import { Parser } from "../parser/Parser";
import { SyntaxBuilder } from "../parser/SyntaxBuilder";
import { SemanticAnalyzer } from "../semanticAnalyzer/SemanticAnalyzer";
import { compressWhiteSpace } from "../utilities";
import { JavaNestedSwitchCaseImplementer } from "./JavaNestedSwitchCaseImplementer";

describe("JavaNestedSwitchCaseImplementer", () => {
  let lexer: Lexer;
  let parser: Parser;
  let builder: SyntaxBuilder;
  let analyzer: SemanticAnalyzer;
  let optimizer: Optimizer;
  let generator: NSCGenerator;
  let emptyFlags: Map<string, string>;

  beforeEach(() => {
    builder = new SyntaxBuilder();
    parser = new Parser(builder);
    lexer = new Lexer(parser);
    analyzer = new SemanticAnalyzer();
    optimizer = new Optimizer();
    generator = new NSCGenerator();
    emptyFlags = new Map<string, string>();
  });

  function produceStateMachine(fsmSyntax: string): OptimizedStateMachine {
    lexer.lex(fsmSyntax);
    parser.eof();
    const ast = analyzer.analyze(builder.getFsm());
    return optimizer.optimize(ast);
  }

  it("should generate code with package and actions", () => {
    const flags = new Map<string, string>();
    flags.set("package", "thePackage");
    const implementer = new JavaNestedSwitchCaseImplementer(flags);
    const sm = produceStateMachine(`
      Initial: I
      Fsm: fsm
      Actions: acts
      {
        I E I A
      }
    `);
    const generatedFsm = generator.generate(sm);
    generatedFsm.accept(implementer);
    expect(compressWhiteSpace(implementer.getOutput())).toEqual(
      compressWhiteSpace(
        "" +
          "package thePackage;\n" +
          "public abstract class fsm implements acts {\n" +
          "public abstract void unhandledTransition(String state, String event);\n" +
          "  private enum State {I}\n" +
          "  private enum Event {E}\n" +
          "  private State state = State.I;\n" +
          "" +
          "  private void setState(State s) {state = s;}\n" +
          "  public void E() {handleEvent(Event.E);}\n" +
          "  private void handleEvent(Event event) {\n" +
          "    switch(state) {\n" +
          "      case I:\n" +
          "        switch(event) {\n" +
          "          case E:\n" +
          "            setState(State.I);\n" +
          "            A();\n" +
          "            break;\n" +
          "          default: unhandledTransition(state.name(), event.name()); break;\n" +
          "        }\n" +
          "        break;\n" +
          "    }\n" +
          "  }\n" +
          "}\n"
      )
    );
  });

  it("should generate code with actions but no package", () => {
    const implementer = new JavaNestedSwitchCaseImplementer(emptyFlags);
    const sm = produceStateMachine(`
      Initial: I
      Fsm: fsm
      Actions: acts
      {
        I E I A
      }
    `);
    const generatedFsm = generator.generate(sm);
    generatedFsm.accept(implementer);
    expect(implementer.getOutput()).toMatch(/^public abstract class fsm implements acts {/);
  });

  it("should generate code with no actions and no package", () => {
    const implementer = new JavaNestedSwitchCaseImplementer(emptyFlags);
    const sm = produceStateMachine(`
      Initial: I
      Fsm: fsm
      {
        I E I A
      }
    `);
    const generatedFsm = generator.generate(sm);
    generatedFsm.accept(implementer);
    const output = implementer.getOutput();
    expect(output).toMatch(/^public abstract class fsm {/);
    expect(output).toContain("protected abstract void A();\n");
  });

  test("two coin turnstile", () => {
    const implementer = new JavaNestedSwitchCaseImplementer(emptyFlags);
    const sm = produceStateMachine(
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
    const generatedFsm = generator.generate(sm);
    generatedFsm.accept(implementer);
    const output = implementer.getOutput();
    expect(output).toMatch(/^public abstract class TwoCoinTurnstile implements Turnstile {/);
    expect(compressWhiteSpace(output)).toEqual(
      compressWhiteSpace(
        "" +
          "public abstract class TwoCoinTurnstile implements Turnstile {\n" +
          "  public abstract void unhandledTransition(String state, String event);\n" +
          "  private enum State {Locked,Alarming,FirstCoin,Unlocked}\n" +
          "  private enum Event {Reset,Pass,Coin}\n" +
          "  private State state = State.Locked;\n" +
          "" +
          "  private void setState(State s) {state = s;}\n" +
          "  public void Reset() {handleEvent(Event.Reset);}\n" +
          "  public void Pass() {handleEvent(Event.Pass);}\n" +
          "  public void Coin() {handleEvent(Event.Coin);}\n" +
          "  private void handleEvent(Event event) {\n" +
          "    switch(state) {\n" +
          "      case Locked:\n" +
          "        switch(event) {\n" +
          "          case Pass:\n" +
          "            setState(State.Alarming);\n" +
          "            alarmOn();\n" +
          "            break;\n" +
          "          case Coin:\n" +
          "            setState(State.FirstCoin);\n" +
          "            break;\n" +
          "          case Reset:\n" +
          "            setState(State.Locked);\n" +
          "            lock();\n" +
          "            break;\n" +
          "          default: unhandledTransition(state.name(), event.name()); break;\n" +
          "        }\n" +
          "        break;\n" +
          "      case Alarming:\n" +
          "        switch(event) {\n" +
          "          case Reset:\n" +
          "            setState(State.Locked);\n" +
          "            alarmOff();\n" +
          "            lock();\n" +
          "            break;\n" +
          "          default: unhandledTransition(state.name(), event.name()); break;\n" +
          "        }\n" +
          "        break;\n" +
          "      case FirstCoin:\n" +
          "        switch(event) {\n" +
          "          case Pass:\n" +
          "            setState(State.Alarming);\n" +
          "            alarmOn();\n" +
          "            break;\n" +
          "          case Coin:\n" +
          "            setState(State.Unlocked);\n" +
          "            unlock();\n" +
          "            break;\n" +
          "          case Reset:\n" +
          "            setState(State.Locked);\n" +
          "            lock();\n" +
          "            break;\n" +
          "          default: unhandledTransition(state.name(), event.name()); break;\n" +
          "        }\n" +
          "        break;\n" +
          "      case Unlocked:\n" +
          "        switch(event) {\n" +
          "          case Pass:\n" +
          "            setState(State.Locked);\n" +
          "            lock();\n" +
          "            break;\n" +
          "          case Coin:\n" +
          "            setState(State.Unlocked);\n" +
          "            thankyou();\n" +
          "            break;\n" +
          "          case Reset:\n" +
          "            setState(State.Locked);\n" +
          "            lock();\n" +
          "            break;\n" +
          "          default: unhandledTransition(state.name(), event.name()); break;\n" +
          "        }\n" +
          "        break;\n" +
          "    }\n" +
          "  }\n" +
          "}\n"
      )
    );
  });
});
