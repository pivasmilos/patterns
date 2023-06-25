import { ParserEvent } from "./ParserEvent";
import { ParserState } from "./ParserState";

export interface Builder {
  newHeaderWithName(): void;
  addHeaderWithValue(): void;
  setStateName(): void;
  done(): void;
  setSuperStateName(): void;
  setEvent(): void;
  setNullEvent(): void;
  setEntryAction(): void;
  setExitAction(): void;
  setStateBase(): void;
  setNextState(): void;
  setNullNextState(): void;
  transitionWithAction(): void;
  transitionNullAction(): void;
  addAction(): void;
  transitionWithActions(): void;
  headerError(state: ParserState, event: ParserEvent, line: number, pos: number): void;
  stateSpecError(state: ParserState, event: ParserEvent, line: number, pos: number): void;
  transitionError(state: ParserState, event: ParserEvent, line: number, pos: number): void;
  transitionGroupError(state: ParserState, event: ParserEvent, line: number, pos: number): void;
  endError(state: ParserState, event: ParserEvent, line: number, pos: number): void;
  syntaxError(line: number, pos: number): void;
  setName(name: string): void;
}
