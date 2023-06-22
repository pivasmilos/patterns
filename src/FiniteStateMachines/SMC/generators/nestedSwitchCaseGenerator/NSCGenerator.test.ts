import { Lexer } from "../../lexer/Lexer";
import { OptimizedStateMachine } from "../../optimizer/OptimizedStateMachine";
import { Optimizer } from "../../optimizer/Optimizer";
import { Parser } from "../../parser/Parser";
import { SyntaxBuilder } from "../../parser/SyntaxBuilder";
import { SemanticAnalyzer } from "../../semanticAnalyzer/SemanticAnalyzer";
import { SemanticStateMachine } from "../../semanticAnalyzer/SemanticStateMachine";
import { NSCGenerator } from "./NSCGenerator";
import { NSCNodeVisitor } from "./NSCNodeVisitor";
import {
  SwitchCaseNode,
  CaseNode,
  FunctionCallNode,
  EnumNode,
  StatePropertyNode,
  EventDelegatorsNode,
  FSMClassNode,
  HandleEventNode,
  EnumeratorNode,
  DefaultCaseNode,
  NSCNode,
} from "./NSCNode";
import { compressWhiteSpace } from "../../utilities";

describe("NSCGenerator", () => {
  let lexer: Lexer;
  let parser: Parser;
  let builder: SyntaxBuilder;
  let analyzer: SemanticAnalyzer;
  let optimizer: Optimizer;
  let generator: NSCGenerator;
  let implementer: NSCNodeVisitor;
  let output = "";
  const stdHead = "Initial: I FSM:f Actions:acts";

  beforeEach(() => {
    generator = new NSCGenerator();
    optimizer = new Optimizer();
    analyzer = new SemanticAnalyzer();
    builder = new SyntaxBuilder();
    parser = new Parser(builder);
    lexer = new Lexer(parser);
    output = "";
  });

  function produceStateMachine(fsmSyntax: string): OptimizedStateMachine {
    lexer.lex(fsmSyntax);
    parser.eof();
    const ast: SemanticStateMachine = analyzer.analyze(builder.getFsm());
    return optimizer.optimize(ast);
  }

  function headerAndSttToSm(header: string, stt: string): OptimizedStateMachine {
    return produceStateMachine(`${header} ${stt}`);
  }

  function assertGenerated(stt: string, switchCase: string): void {
    const sm: OptimizedStateMachine = headerAndSttToSm(stdHead, stt);
    generator.generate(sm).accept(implementer);
    expect(compressWhiteSpace(output)).toEqual(compressWhiteSpace(switchCase));
  }

  class EmptyVisitor implements NSCNodeVisitor {
    visit(node: NSCNode): void {
      if (node instanceof SwitchCaseNode) {
        // Handle SwitchCaseNode
      } else if (node instanceof CaseNode) {
        // Handle CaseNode
      } else if (node instanceof FunctionCallNode) {
        // Handle FunctionCallNode
      } else if (node instanceof EnumNode) {
        // Handle EnumNode
      } else if (node instanceof StatePropertyNode) {
        // Handle StatePropertyNode
      } else if (node instanceof EventDelegatorsNode) {
        // Handle EventDelegatorsNode
      } else if (node instanceof HandleEventNode) {
        node.switchCase.accept(this);
      } else if (node instanceof EnumeratorNode) {
        output += `${node.enumeration}.${node.enumerator}`;
      } else if (node instanceof DefaultCaseNode) {
        output += ` default(${node.state});`;
      } else if (node instanceof FSMClassNode) {
        node.delegators?.accept(this);
        node.stateEnum?.accept(this);
        node.eventEnum?.accept(this);
        node.stateProperty?.accept(this);
        node.handleEvent?.accept(this);
      }
    }
  }

  describe("SwitchCaseTests", () => {
    beforeEach(() => {
      implementer = new TestVisitor();
    });

    class TestVisitor extends EmptyVisitor {
      override visit(node: NSCNode): void {
        if (node instanceof SwitchCaseNode) {
          output += `s ${node.variableName} {`;
          node.generateCases(implementer);
          output += "} ";
        } else if (node instanceof CaseNode) {
          output += `case ${node.caseName} {`;
          node.caseActionNode?.accept(this);
          output += "} ";
        } else if (node instanceof FunctionCallNode) {
          output += `${node.functionName}(`;
          if (node.argument !== undefined) node.argument.accept(this);
          output += ") ";
        } else {
          super.visit(node);
        }
      }
    }

    it("One transition", () => {
      assertGenerated("{I e I a}", "s state {case I {s event {case e {setState(State.I) a() } default(I);} } } ");
    });

    it("Two transitions", () => {
      assertGenerated(
        "{I e1 S a1 S e2 I a2}",
        "s state {" +
          "case I {s event {case e1 {setState(State.S) a1() } default(I);} } " +
          "case S {s event {case e2 {setState(State.I) a2() } default(S);} } " +
          "} "
      );
    });

    it("Two states two events four actions", () => {
      assertGenerated(
        "{I e1 S a1 I e2 - a2 S e1 I a3 S e2 - a4}",
        "s state {" +
          "case I {s event {case e1 {setState(State.S) a1() } case e2 {setState(State.I) a2() } default(I);} } " +
          "case S {s event {case e1 {setState(State.I) a3() } case e2 {setState(State.S) a4() } default(S);} } " +
          "} "
      );
    });
  });

  describe("EnumTests", () => {
    beforeEach(() => {
      implementer = new EnumVisitor();
    });

    class EnumVisitor extends EmptyVisitor {
      override visit(node: NSCNode): void {
        if (node instanceof EnumNode) {
          output += `enum ${node.name} [${node.enumerators}] `;
        } else {
          super.visit(node);
        }
      }
    }

    test("States and events", () => {
      assertGenerated(
        "" + "{" + "  I e1 S a1 " + "  I e2 - a2" + "  S e1 I a3" + "  S e2 - a4" + "}",
        "enum State [I,S] enum Event [e1,e2] "
      );
    });
  });

  describe("StatePropertyTest", () => {
    beforeEach(() => {
      implementer = new StatePropertyVisitor();
    });

    class StatePropertyVisitor extends EmptyVisitor {
      override visit(node: NSCNode): void {
        if (node instanceof StatePropertyNode) {
          output += `state property = ${node.initialState}`;
        } else {
          super.visit(node);
        }
      }
    }

    test("statePropertyIsCreated", () => {
      assertGenerated("{I e I a}", "state property = I");
    });
  });

  describe("EventDelegators", () => {
    beforeEach(() => {
      implementer = new EventDelegatorVisitor();
    });

    class EventDelegatorVisitor extends EmptyVisitor {
      override visit(node: NSCNode): void {
        if (node instanceof EventDelegatorsNode) {
          output += `delegators [${node.events}]`;
        } else {
          super.visit(node);
        }
      }
    }

    test("eventDelegatorsAreGenerated", () => {
      assertGenerated(
        "" + "{" + "  I e1 S a1 " + "  I e2 - a2" + "  S e1 I a3" + "  S e2 - a4" + "}",
        "delegators [e1,e2]"
      );
    });
  });

  describe("HandleEventTest", () => {
    beforeEach(() => {
      implementer = new HandleEventVisitor();
    });

    class HandleEventVisitor extends EmptyVisitor {
      override visit(node: NSCNode): void {
        if (node instanceof SwitchCaseNode) {
          output += "s";
        } else if (node instanceof HandleEventNode) {
          output += "he(";
          node.switchCase.accept(this);
          output += ")";
        } else {
          super.visit(node);
        }
      }
    }

    test("handleEventIsGenerated", () => {
      assertGenerated("{I e I a}", "he(s)");
    });
  });

  describe("FsmClassTest", () => {
    beforeEach(() => {
      implementer = new FSMClassVisitor();
    });

    class FSMClassVisitor extends EmptyVisitor {
      override visit(node: NSCNode): void {
        if (node instanceof SwitchCaseNode) {
          output += "sc";
        } else if (node instanceof EnumNode) {
          output += "e ";
        } else if (node instanceof StatePropertyNode) {
          output += "p ";
        } else if (node instanceof EventDelegatorsNode) {
          output += "d ";
        } else if (node instanceof HandleEventNode) {
          output += "he ";
        } else if (node instanceof FSMClassNode) {
          const fsmClassNode = node as FSMClassNode;
          output += `class ${fsmClassNode.className}:${fsmClassNode.actionsName} {`;
          fsmClassNode.delegators?.accept(this);
          fsmClassNode.stateEnum?.accept(this);
          fsmClassNode.eventEnum?.accept(this);
          fsmClassNode.stateProperty?.accept(this);
          fsmClassNode.handleEvent?.accept(this);
          fsmClassNode.handleEvent?.switchCase.accept(this);
          output += "}";
        }
      }
    }

    test("fsmClassNodeIsGenerated", () => {
      assertGenerated("{I e I a}", "class f:acts {d e e p he sc}");
    });
  });
});
