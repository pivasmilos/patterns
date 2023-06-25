/**
 *
 * <FSM> ::= <header>* <logic>
 * <header> ::= "Actions:" <name> | "FSM:" <name> | "Initial:" <name>
 *
 * <logic> ::= "{" <transition>* "}"
 *
 * <transition> ::= <state-spec> <subtransition>
 *             |   <state-spec> "{" <subtransition>* "}"
 *
 * <subtransition>   ::= <event-spec> <next-state> <action-spec>
 * <action-spec>     ::= <action> | "{" <action>* "}" | "-"
 * <state-spec>      ::= <state> <state-modifiers>
 * <state-modifiers> ::= "" | <state-modifier> | <state-modifier> <state-modifiers>
 * <state-modifier>  ::= ":" <state>
 *                 |   "<" <action-spec>
 *                 |   ">" <action-spec>
 *
 * <next-state> ::= <state> | "-"
 * <event-spec> :: <event> | "-"
 * <action> ::= <name>
 * <state> ::= <name>
 * <event> ::= <name>
 */

import { TokenCollector } from "../lexer/TokenCollector";
import { Builder } from "./Builder";
import { ParserEvent as PE } from "./ParserEvent";
import { ParserState as PS } from "./ParserState";
import { ParserTransition as PT } from "./ParserTransition";

export class Parser implements TokenCollector {
  private state: PS = PS.HEADER;

  constructor(private readonly builder: Builder) {}

  public openBrace(line: number, pos: number): void {
    this.handleEvent(PE.OPEN_BRACE, line, pos);
  }

  public closedBrace(line: number, pos: number): void {
    this.handleEvent(PE.CLOSED_BRACE, line, pos);
  }

  public openParen(line: number, pos: number): void {
    this.handleEvent(PE.OPEN_PAREN, line, pos);
  }

  public closedParen(line: number, pos: number): void {
    this.handleEvent(PE.CLOSED_PAREN, line, pos);
  }

  public openAngle(line: number, pos: number): void {
    this.handleEvent(PE.OPEN_ANGLE, line, pos);
  }

  public closedAngle(line: number, pos: number): void {
    this.handleEvent(PE.CLOSED_ANGLE, line, pos);
  }

  public dash(line: number, pos: number): void {
    this.handleEvent(PE.DASH, line, pos);
  }

  public colon(line: number, pos: number): void {
    this.handleEvent(PE.COLON, line, pos);
  }

  public name(name: string, line: number, pos: number): void {
    this.builder.setName(name);
    this.handleEvent(PE.NAME, line, pos);
  }

  public error(line: number, pos: number): void {
    this.builder.syntaxError(line, pos);
  }

  public eof(): void {
    this.handleEvent(PE.EOF, -1, -1);
  }

  private handleEvent(event: PE, line: number, pos: number): void {
    const transition = this.transitions.find((t) => t.currentState === this.state && t.event === event);

    if (!transition) {
      this.handleEventError(event, line, pos);
      return;
    }

    this.state = transition.newState;
    transition.action?.(this.builder);
  }

  private handleEventError(event: PE, line: number, pos: number): void {
    switch (this.state) {
      case PS.HEADER:
      case PS.HEADER_COLON:
      case PS.HEADER_VALUE:
        this.builder.headerError(this.state, event, line, pos);
        break;

      case PS.STATE_SPEC:
      case PS.SUPER_STATE_NAME:
      case PS.SUPER_STATE_CLOSE:
      case PS.STATE_MODIFIER:
      case PS.EXIT_ACTION:
      case PS.ENTRY_ACTION:
      case PS.STATE_BASE:
        this.builder.stateSpecError(this.state, event, line, pos);
        break;

      case PS.SINGLE_EVENT:
      case PS.SINGLE_NEXT_STATE:
      case PS.SINGLE_ACTION_GROUP:
      case PS.SINGLE_ACTION_GROUP_NAME:
        this.builder.transitionError(this.state, event, line, pos);
        break;

      case PS.SUBTRANSITION_GROUP:
      case PS.GROUP_EVENT:
      case PS.GROUP_NEXT_STATE:
      case PS.GROUP_ACTION_GROUP:
      case PS.GROUP_ACTION_GROUP_NAME:
        this.builder.transitionGroupError(this.state, event, line, pos);
        break;

      case PS.END:
        this.builder.endError(this.state, event, line, pos);
        break;
    }
  }

  private readonly transitions: PT[] = [
    new PT(PS.HEADER, PE.NAME, PS.HEADER_COLON, (t) => t.newHeaderWithName()),
    new PT(PS.HEADER, PE.OPEN_BRACE, PS.STATE_SPEC, null),
    new PT(PS.HEADER_COLON, PE.COLON, PS.HEADER_VALUE, null),
    new PT(PS.HEADER_VALUE, PE.NAME, PS.HEADER, (t) => t.addHeaderWithValue()),
    new PT(PS.STATE_SPEC, PE.OPEN_PAREN, PS.SUPER_STATE_NAME, null),
    new PT(PS.STATE_SPEC, PE.NAME, PS.STATE_MODIFIER, (t) => t.setStateName()),
    new PT(PS.STATE_SPEC, PE.CLOSED_BRACE, PS.END, (t) => t.done()),
    new PT(PS.SUPER_STATE_NAME, PE.NAME, PS.SUPER_STATE_CLOSE, (t) => t.setSuperStateName()),
    new PT(PS.SUPER_STATE_CLOSE, PE.CLOSED_PAREN, PS.STATE_MODIFIER, null),
    new PT(PS.STATE_MODIFIER, PE.OPEN_ANGLE, PS.ENTRY_ACTION, null),
    new PT(PS.STATE_MODIFIER, PE.CLOSED_ANGLE, PS.EXIT_ACTION, null),
    new PT(PS.STATE_MODIFIER, PE.COLON, PS.STATE_BASE, null),
    new PT(PS.STATE_MODIFIER, PE.NAME, PS.SINGLE_EVENT, (t) => t.setEvent()),
    new PT(PS.STATE_MODIFIER, PE.DASH, PS.SINGLE_EVENT, (t) => t.setNullEvent()),
    new PT(PS.STATE_MODIFIER, PE.OPEN_BRACE, PS.SUBTRANSITION_GROUP, null),
    new PT(PS.ENTRY_ACTION, PE.NAME, PS.STATE_MODIFIER, (t) => t.setEntryAction()),
    new PT(PS.ENTRY_ACTION, PE.OPEN_BRACE, PS.MULTIPLE_ENTRY_ACTIONS, null),
    new PT(PS.MULTIPLE_ENTRY_ACTIONS, PE.NAME, PS.MULTIPLE_ENTRY_ACTIONS, (t) => t.setEntryAction()),
    new PT(PS.MULTIPLE_ENTRY_ACTIONS, PE.CLOSED_BRACE, PS.STATE_MODIFIER, null),
    new PT(PS.EXIT_ACTION, PE.NAME, PS.STATE_MODIFIER, (t) => t.setExitAction()),
    new PT(PS.EXIT_ACTION, PE.OPEN_BRACE, PS.MULTIPLE_EXIT_ACTIONS, null),
    new PT(PS.MULTIPLE_EXIT_ACTIONS, PE.NAME, PS.MULTIPLE_EXIT_ACTIONS, (t) => t.setExitAction()),
    new PT(PS.MULTIPLE_EXIT_ACTIONS, PE.CLOSED_BRACE, PS.STATE_MODIFIER, null),
    new PT(PS.STATE_BASE, PE.NAME, PS.STATE_MODIFIER, (t) => t.setStateBase()),
    new PT(PS.SINGLE_EVENT, PE.NAME, PS.SINGLE_NEXT_STATE, (t) => t.setNextState()),
    new PT(PS.SINGLE_EVENT, PE.DASH, PS.SINGLE_NEXT_STATE, (t) => t.setNullNextState()),
    new PT(PS.SINGLE_NEXT_STATE, PE.NAME, PS.STATE_SPEC, (t) => t.transitionWithAction()),
    new PT(PS.SINGLE_NEXT_STATE, PE.DASH, PS.STATE_SPEC, (t) => t.transitionNullAction()),
    new PT(PS.SINGLE_NEXT_STATE, PE.OPEN_BRACE, PS.SINGLE_ACTION_GROUP, null),
    new PT(PS.SINGLE_ACTION_GROUP, PE.NAME, PS.SINGLE_ACTION_GROUP_NAME, (t) => t.addAction()),
    new PT(PS.SINGLE_ACTION_GROUP, PE.CLOSED_BRACE, PS.STATE_SPEC, (t) => t.transitionNullAction()),
    new PT(PS.SINGLE_ACTION_GROUP_NAME, PE.NAME, PS.SINGLE_ACTION_GROUP_NAME, (t) => t.addAction()),
    new PT(PS.SINGLE_ACTION_GROUP_NAME, PE.CLOSED_BRACE, PS.STATE_SPEC, (t) => t.transitionWithActions()),
    new PT(PS.SUBTRANSITION_GROUP, PE.CLOSED_BRACE, PS.STATE_SPEC, null),
    new PT(PS.SUBTRANSITION_GROUP, PE.NAME, PS.GROUP_EVENT, (t) => t.setEvent()),
    new PT(PS.SUBTRANSITION_GROUP, PE.DASH, PS.GROUP_EVENT, (t) => t.setNullEvent()),
    new PT(PS.GROUP_EVENT, PE.NAME, PS.GROUP_NEXT_STATE, (t) => t.setNextState()),
    new PT(PS.GROUP_EVENT, PE.DASH, PS.GROUP_NEXT_STATE, (t) => t.setNullNextState()),
    new PT(PS.GROUP_NEXT_STATE, PE.NAME, PS.SUBTRANSITION_GROUP, (t) => t.transitionWithAction()),
    new PT(PS.GROUP_NEXT_STATE, PE.DASH, PS.SUBTRANSITION_GROUP, (t) => t.transitionNullAction()),
    new PT(PS.GROUP_NEXT_STATE, PE.OPEN_BRACE, PS.GROUP_ACTION_GROUP, null),
    new PT(PS.GROUP_ACTION_GROUP, PE.NAME, PS.GROUP_ACTION_GROUP_NAME, (t) => t.addAction()),
    new PT(PS.GROUP_ACTION_GROUP, PE.CLOSED_BRACE, PS.SUBTRANSITION_GROUP, (t) => t.transitionNullAction()),
    new PT(PS.GROUP_ACTION_GROUP_NAME, PE.NAME, PS.GROUP_ACTION_GROUP_NAME, (t) => t.addAction()),
    new PT(PS.GROUP_ACTION_GROUP_NAME, PE.CLOSED_BRACE, PS.SUBTRANSITION_GROUP, (t) => t.transitionWithActions()),
    new PT(PS.END, PE.EOF, PS.END, null),
  ];
}
