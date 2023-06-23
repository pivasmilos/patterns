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
    visitSwitchCaseNode(_node: SwitchCaseNode): void {
      // no-op
    }
    visitCaseNode(_node: CaseNode): void {
      // no-op
    }
    visitFunctionCallNode(_node: FunctionCallNode): void {
      // no-op
    }
    visitEnumNode(_node: EnumNode): void {
      // no-op
    }
    visitStatePropertyNode(_node: StatePropertyNode): void {
      // no-op
    }
    visitEventDelegatorsNode(_node: EventDelegatorsNode): void {
      // no-op
    }

    visitFSMClassNode(node: FSMClassNode) {
      node.delegators?.accept(this);
      node.stateEnum?.accept(this);
      node.eventEnum?.accept(this);
      node.stateProperty?.accept(this);
      node.handleEvent?.accept(this);
    }
    visitHandleEventNode(node: HandleEventNode) {
      node.switchCase.accept(this);
    }
    visitEnumeratorNode(node: EnumeratorNode) {
      output += `${node.enumeration}.${node.enumerator}`;
    }
    visitDefaultCaseNode(node: DefaultCaseNode) {
      output += ` default(${node.state});`;
    }
  }

  describe("SwitchCaseTests", () => {
    beforeEach(() => {
      implementer = new TestVisitor();
    });

    class TestVisitor extends EmptyVisitor {
      override visitSwitchCaseNode(node: SwitchCaseNode): void {
        output += `s ${node.variableName} {`;
        node.generateCases(implementer);
        output += "} ";
      }

      override visitCaseNode(node: CaseNode): void {
        output += `case ${node.caseName} {`;
        node.caseActionNode?.accept(this);
        output += "} ";
      }

      override visitFunctionCallNode(node: FunctionCallNode): void {
        output += `${node.functionName}(`;
        if (node.argument !== undefined) node.argument.accept(this);
        output += ") ";
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
      override visitEnumNode(node: EnumNode): void {
        output += `enum ${node.name} [${node.enumerators}] `;
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
      override visitStatePropertyNode(node: StatePropertyNode): void {
        output += `state property = ${node.initialState}`;
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
      override visitEventDelegatorsNode(node: EventDelegatorsNode): void {
        output += `delegators [${node.events}]`;
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
      override visitSwitchCaseNode(_node: SwitchCaseNode): void {
        output += "s";
      }

      override visitHandleEventNode(node: HandleEventNode): void {
        output += "he(";
        node.switchCase.accept(this);
        output += ")";
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
      override visitSwitchCaseNode(_node: SwitchCaseNode): void {
        output += "sc";
      }

      override visitEnumNode(_node: EnumNode): void {
        output += "e ";
      }

      override visitStatePropertyNode(_node: StatePropertyNode): void {
        output += "p ";
      }

      override visitEventDelegatorsNode(_node: EventDelegatorsNode): void {
        output += "d ";
      }
      override visitHandleEventNode(_node: HandleEventNode): void {
        output += "he ";
      }
      override visitFSMClassNode(node: FSMClassNode): void {
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

    test("fsmClassNodeIsGenerated", () => {
      assertGenerated("{I e I a}", "class f:acts {d e e p he sc}");
    });
  });
});
