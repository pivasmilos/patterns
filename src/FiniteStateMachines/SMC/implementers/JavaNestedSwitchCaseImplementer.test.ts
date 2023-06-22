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
});
