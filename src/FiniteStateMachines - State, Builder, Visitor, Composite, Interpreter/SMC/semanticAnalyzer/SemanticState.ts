import { Comparable } from "./Comparable";
import { SemanticTransition } from "./SemanticTransition";

export class SemanticState implements Comparable<SemanticState> {
  public entryActions: string[] = [];
  public exitActions: string[] = [];
  public isAbstractState = false;
  public superStates = new Set<SemanticState>();
  public transitions: SemanticTransition[] = [];

  public constructor(public name: string) {}

  public equals(obj: SemanticState): boolean {
    return (
      obj.name === this.name &&
      obj.entryActions === this.entryActions &&
      obj.exitActions === this.exitActions &&
      obj.superStates === this.superStates &&
      obj.transitions === this.transitions &&
      obj.isAbstractState === this.isAbstractState
    );
  }

  public toString(): string {
    return `\n  ${this.makeStateNameWithAdornments()} {\n${this.makeTransitionStrings()}  }\n`;
  }

  private makeTransitionStrings(): string {
    return this.transitions.map((st) => this.makeTransitionString(st)).join("");
  }

  private makeTransitionString(st: SemanticTransition): string {
    return `    ${st.event} ${this.makeNextStateName(st)} {${this.makeActions(st)}}\n`;
  }

  private makeActions(st: SemanticTransition): string {
    return st.actions.join(" ");
  }

  private makeNextStateName(st: SemanticTransition): string {
    return st.nextState === null ? "null" : st.nextState.name;
  }

  private makeStateNameWithAdornments(): string {
    const { name, isAbstractState, superStates, entryActions, exitActions } = this;
    const stateName = isAbstractState ? `(${name})` : name;
    const superStateNames = Array.from(superStates, (s) => `:${s.name}`);
    const entryActionNames = entryActions.map((a) => `<${a}`);
    const exitActionNames = exitActions.map((a) => `>${a}`);
    return [stateName, ...superStateNames, ...entryActionNames, ...exitActionNames].join(" ");
  }

  public compareTo(s: SemanticState): number {
    return this.name.localeCompare(s.name);
  }

  public isSuperStateOf(possibleSuperState: SemanticState): boolean {
    if (this === possibleSuperState) {
      return true;
    }
    for (const superState of this.superStates) {
      if (superState.isSuperStateOf(possibleSuperState)) {
        return true;
      }
    }
    return false;
  }
}
