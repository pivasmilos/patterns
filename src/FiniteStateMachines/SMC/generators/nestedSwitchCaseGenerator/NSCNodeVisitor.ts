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

export interface NSCNodeVisitor {
  visit(
    node:
      | SwitchCaseNode
      | CaseNode
      | FunctionCallNode
      | EnumNode
      | StatePropertyNode
      | EventDelegatorsNode
      | FSMClassNode
      | HandleEventNode
      | EnumeratorNode
      | DefaultCaseNode
  ): void;
}
