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
} from "../generators/nestedSwitchCaseGenerator/NSCNode";
import { NSCNodeVisitor } from "../generators/nestedSwitchCaseGenerator/NSCNodeVisitor";
import { commaList } from "../utilities";

export class JavaNestedSwitchCaseImplementer implements NSCNodeVisitor {
  private output = "";
  private flags: Map<string, string>;
  private javaPackage?: string;

  constructor(flags: Map<string, string>) {
    this.flags = flags;
    if (this.flags.has("package")) {
      this.javaPackage = this.flags.get("package");
    }
  }

  public visit(node: NSCNode): void {
    if (node instanceof SwitchCaseNode) {
      this.output += `switch(${node.variableName}) {\n`;
      node.generateCases(this);
      this.output += "}\n";
    } else if (node instanceof CaseNode) {
      this.output += `case ${node.caseName}:\n`;
      node.caseActionNode?.accept(this);
      this.output += "break;\n";
    } else if (node instanceof FunctionCallNode) {
      this.output += `${node.functionName}(`;
      node.argument?.accept(this);
      this.output += ");\n";
    } else if (node instanceof EnumNode) {
      this.output += `private enum ${node.name} {${commaList(node.enumerators)}}\n`;
    } else if (node instanceof StatePropertyNode) {
      this.output += `private State state = State.${node.initialState};\n`;
      this.output += "private void setState(State s) {state = s;}\n";
    } else if (node instanceof EventDelegatorsNode) {
      for (const event of node.events) {
        this.output += `public void ${event}() {handleEvent(Event.${event});}\n`;
      }
    } else if (node instanceof FSMClassNode) {
      if (this.javaPackage) {
        this.output += `package ${this.javaPackage};\n`;
      }

      const actionsName = node.actionsName;
      if (!actionsName) {
        this.output += `public abstract class ${node.className} {\n`;
      } else {
        this.output += `public abstract class ${node.className} implements ${actionsName} {\n`;
      }

      this.output += "public abstract void unhandledTransition(String state, String event);\n";
      node.stateEnum?.accept(this);
      node.eventEnum?.accept(this);
      node.stateProperty?.accept(this);
      node.delegators?.accept(this);
      node.handleEvent?.accept(this);
      if (!actionsName) {
        for (const action of node.actions) {
          this.output += `protected abstract void ${action}();\n`;
        }
      }
      this.output += "}\n";
    } else if (node instanceof HandleEventNode) {
      this.output += "private void handleEvent(Event event) {\n";
      node.switchCase.accept(this);
      this.output += "}\n";
    } else if (node instanceof EnumeratorNode) {
      this.output += `${node.enumeration}.${node.enumerator}`;
    } else if (node instanceof DefaultCaseNode) {
      this.output += "default: unhandledTransition(state.name(), event.name()); break;\n";
    }
  }

  public getOutput(): string {
    return this.output;
  }
}
