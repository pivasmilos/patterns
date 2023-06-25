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
} from "../generators/nestedSwitchCaseGenerator/NSCNode";
import { NSCNodeVisitor } from "../generators/nestedSwitchCaseGenerator/NSCNodeVisitor";

export class JavaNestedSwitchCaseImplementer implements NSCNodeVisitor {
  private output = "";
  private readonly javaPackage?: string;

  constructor(private readonly flags: Map<string, string>) {
    if (this.flags.has("package")) {
      this.javaPackage = this.flags.get("package");
    }
  }

  public visitSwitchCaseNode(node: SwitchCaseNode): void {
    this.output += `  switch(${node.variableName}) {\n`;
    node.generateCases(this);
    this.output += "  }\n";
  }

  public visitCaseNode(node: CaseNode): void {
    this.output += `    case ${node.caseName}:\n`;
    node.caseActionNode?.accept(this);
    this.output += "      break;\n";
  }

  public visitFunctionCallNode(node: FunctionCallNode): void {
    this.output += `      ${node.functionName}(`;
    node.argument?.accept(this);
    this.output += ");\n";
  }

  public visitEnumNode(node: EnumNode): void {
    this.output += `private enum ${node.name} {${node.enumerators.join(",")}}\n`;
  }

  public visitStatePropertyNode(node: StatePropertyNode): void {
    this.output += //
      `private State state = State.${node.initialState};\n` + //
      "private void setState(State s) {state = s;}\n";
  }

  public visitEventDelegatorsNode(node: EventDelegatorsNode): void {
    for (const event of node.events) {
      this.output += `public void ${event}() {handleEvent(Event.${event});}\n`;
    }
  }

  public visitFSMClassNode(node: FSMClassNode): void {
    const { className, actionsName, actions } = node;
    if (this.javaPackage) {
      this.output += `package ${this.javaPackage};\n`;
    }

    if (!actionsName) {
      this.output += `public abstract class ${className} {\n`;
      for (const action of actions) {
        this.output += `protected abstract void ${action}();\n`;
      }
    } else {
      this.output += `public abstract class ${className} implements ${actionsName} {\n`;
      // no need to declare abstract actions, they are implicitly declared through the interface
    }

    this.output += "public abstract void unhandledTransition(String state, String event);\n";
    node.stateEnum?.accept(this);
    node.eventEnum?.accept(this);
    node.stateProperty?.accept(this);
    node.delegators?.accept(this);
    node.handleEvent?.accept(this);
    this.output += "}\n";
  }

  public visitHandleEventNode(node: HandleEventNode): void {
    this.output += "private void handleEvent(Event event) {\n";
    node.switchCase.accept(this);
    this.output += "}\n";
  }

  public visitEnumeratorNode(node: EnumeratorNode): void {
    this.output += `${node.enumeration}.${node.enumerator}`;
  }

  public visitDefaultCaseNode(): void {
    this.output += "    default: unhandledTransition(state.name(), event.name()); break;\n";
  }

  public getOutput(): string {
    return this.output;
  }
}
