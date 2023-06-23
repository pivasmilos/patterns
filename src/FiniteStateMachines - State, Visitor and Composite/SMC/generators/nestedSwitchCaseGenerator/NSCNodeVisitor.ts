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
  visitSwitchCaseNode(node: SwitchCaseNode): void;
  visitCaseNode(node: CaseNode): void;
  visitFunctionCallNode(node: FunctionCallNode): void;
  visitEnumNode(node: EnumNode): void;
  visitStatePropertyNode(node: StatePropertyNode): void;
  visitEventDelegatorsNode(node: EventDelegatorsNode): void;
  visitFSMClassNode(node: FSMClassNode): void;
  visitHandleEventNode(node: HandleEventNode): void;
  visitEnumeratorNode(node: EnumeratorNode): void;
  visitDefaultCaseNode(node: DefaultCaseNode): void;
}
