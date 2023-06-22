import { OptimizedStateMachine, Transition, SubTransition } from "../../optimizer/OptimizedStateMachine";
import {
  EnumNode,
  EventDelegatorsNode,
  StatePropertyNode,
  HandleEventNode,
  SwitchCaseNode,
  NSCNode,
  FSMClassNode,
  CaseNode,
  DefaultCaseNode,
  CompositeNode,
  FunctionCallNode,
  EnumeratorNode,
} from "./NSCNode";

export class NSCGenerator {
  // non null assertions are ok because everything is assigned in generate - the only public method
  private stateEnumNode!: EnumNode;
  private eventEnumNode!: EnumNode;
  private eventDelegatorsNode!: EventDelegatorsNode;
  private statePropertyNode!: StatePropertyNode;
  private handleEventNode!: HandleEventNode;
  private stateSwitch!: SwitchCaseNode;

  public generate(sm: OptimizedStateMachine): NSCNode {
    this.eventDelegatorsNode = new EventDelegatorsNode(sm.events);
    this.statePropertyNode = new StatePropertyNode(sm.header.initial);
    this.stateEnumNode = new EnumNode("State", sm.states);
    this.eventEnumNode = new EnumNode("Event", sm.events);
    this.stateSwitch = new SwitchCaseNode("state");
    this.addStateCases(sm);
    this.handleEventNode = new HandleEventNode(this.stateSwitch);
    return this.makeFsmNode(sm);
  }

  private makeFsmNode(sm: OptimizedStateMachine): FSMClassNode {
    const fsm = new FSMClassNode();
    fsm.className = sm.header.fsm;
    fsm.actionsName = sm.header.actions;
    fsm.stateEnum = this.stateEnumNode;
    fsm.eventEnum = this.eventEnumNode;
    fsm.delegators = this.eventDelegatorsNode;
    fsm.stateProperty = this.statePropertyNode;
    fsm.handleEvent = this.handleEventNode;
    fsm.actions = sm.actions;
    return fsm;
  }

  private addStateCases(sm: OptimizedStateMachine): void {
    for (const t of sm.transitions) {
      this.addStateCase(this.stateSwitch, t);
    }
  }

  private addStateCase(stateSwitch: SwitchCaseNode, t: Transition): void {
    const stateCaseNode = new CaseNode("State", t.currentState);
    this.addEventCases(stateCaseNode, t);
    stateSwitch.caseNodes.push(stateCaseNode);
  }

  private addEventCases(stateCaseNode: CaseNode, t: Transition): void {
    const eventSwitch = new SwitchCaseNode("event");
    stateCaseNode.caseActionNode = eventSwitch;
    for (const st of t.subTransitions) {
      this.addEventCase(eventSwitch, st);
    }
    eventSwitch.caseNodes.push(new DefaultCaseNode(t.currentState));
  }

  private addEventCase(eventSwitch: SwitchCaseNode, st: SubTransition): void {
    const eventCaseNode = new CaseNode("Event", st.event);
    this.addActions(st, eventCaseNode);
    eventSwitch.caseNodes.push(eventCaseNode);
  }

  private addActions(st: SubTransition, eventCaseNode: CaseNode): void {
    const actions = new CompositeNode();
    this.addSetStateNode(st.nextState, actions);
    for (const action of st.actions) {
      actions.add(new FunctionCallNode(action));
    }
    eventCaseNode.caseActionNode = actions;
  }

  private addSetStateNode(stateName: string, actions: CompositeNode): void {
    const enumeratorNode = new EnumeratorNode("State", stateName);
    const setStateNode = new FunctionCallNode("setState", enumeratorNode);
    actions.add(setStateNode);
  }
}
