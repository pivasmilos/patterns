import { Builder } from "./Builder";
import { ErrorType, FsmSyntax, Header, StateSpec, SubTransition, Transition, SyntaxError } from "./FsmSyntax";
import { ParserEvent } from "./ParserEvent";
import { ParserState } from "./ParserState";

export class SyntaxBuilder implements Builder {
  private readonly fsm = new FsmSyntax();
  private header: Header = new Header();
  private parsedName = "";
  private transition = new Transition();
  private subtransition = new SubTransition();

  public newHeaderWithName(): void {
    this.header = new Header();
    this.header.name = this.parsedName;
  }

  public addHeaderWithValue(): void {
    this.header.value = this.parsedName;
    this.fsm.headers.push(this.header);
  }

  public setStateName(): void {
    this.transition = new Transition();
    this.fsm.logic.push(this.transition);
    this.transition.state = new StateSpec();
    this.transition.state.name = this.parsedName;
  }

  public done(): void {
    this.fsm.done = true;
  }

  public setSuperStateName(): void {
    this.setStateName();
    this.transition.state.isAbstractState = true;
  }

  public setEvent(): void {
    this.subtransition = new SubTransition();
    this.subtransition.event = this.parsedName;
  }

  public setNullEvent(): void {
    this.subtransition = new SubTransition();
    this.subtransition.event = null;
  }

  public setEntryAction(): void {
    this.transition.state.entryActions.push(this.parsedName);
  }

  public setExitAction(): void {
    this.transition.state.exitActions.push(this.parsedName);
  }

  public setStateBase(): void {
    this.transition.state.superStates.push(this.parsedName);
  }

  public setNextState(): void {
    this.subtransition.nextState = this.parsedName;
  }

  public setNullNextState(): void {
    this.subtransition.nextState = null;
  }

  public transitionWithAction(): void {
    this.subtransition.actions.push(this.parsedName);
    this.transition.subTransitions.push(this.subtransition);
  }

  public transitionNullAction(): void {
    this.transition.subTransitions.push(this.subtransition);
  }

  public addAction(): void {
    this.subtransition.actions.push(this.parsedName);
  }

  public transitionWithActions(): void {
    this.transition.subTransitions.push(this.subtransition);
  }

  public headerError(state: ParserState, event: ParserEvent, line: number, pos: number): void {
    this.fsm.errors.push(new SyntaxError(ErrorType.HEADER, state + "|" + event, line, pos));
  }

  public stateSpecError(state: ParserState, event: ParserEvent, line: number, pos: number): void {
    this.fsm.errors.push(new SyntaxError(ErrorType.STATE, state + "|" + event, line, pos));
  }

  public transitionError(state: ParserState, event: ParserEvent, line: number, pos: number): void {
    this.fsm.errors.push(new SyntaxError(ErrorType.TRANSITION, state + "|" + event, line, pos));
  }

  public transitionGroupError(state: ParserState, event: ParserEvent, line: number, pos: number): void {
    this.fsm.errors.push(new SyntaxError(ErrorType.TRANSITION_GROUP, state + "|" + event, line, pos));
  }

  public endError(state: ParserState, event: ParserEvent, line: number, pos: number): void {
    this.fsm.errors.push(new SyntaxError(ErrorType.END, state + "|" + event, line, pos));
  }

  public syntaxError(line: number, pos: number): void {
    this.fsm.errors.push(new SyntaxError(ErrorType.SYNTAX, "", line, pos));
  }

  public setName(name: string): void {
    this.parsedName = name;
  }

  public getFsm(): FsmSyntax {
    return this.fsm;
  }
}
