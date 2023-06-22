import { AnalysisError } from "./AnalysisError";
import { Comparable } from "./Comparable";

export class SemanticStateMachine {
  public errors: AnalysisError[] = [];
  public warnings: AnalysisError[] = [];
  public states = new Map<string, SemanticState>();
  public events = new Set<string>();
  public actions = new Set<string>();
  public initialState: SemanticState | null = null;
  public actionClass: string | null = null;
  public fsmName: string | null = null;

  public toString(): string {
    return [
      `Actions: ${this.actionClass}`,
      `FSM: ${this.fsmName}`,
      `Initial: ${this.initialState?.name ?? null}`,
      this.statesToString(),
    ].join("\n");
  }

  public addError(analysisError: AnalysisError): void {
    this.errors.push(analysisError);
  }

  public statesToString(): string {
    const states = Array.from(this.states.values())
      .map((s) => s.toString())
      .join("");
    return `{${states}}\n`;
  }
}

export class SemanticState implements Comparable<SemanticState> {
  public name: string;
  public entryActions: string[] = [];
  public exitActions: string[] = [];
  public isAbstractState = false;
  public superStates = new Set<SemanticState>();
  public transitions: SemanticTransition[] = [];

  public constructor(name: string) {
    this.name = name;
  }

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
    const stateName = this.isAbstractState ? `(${this.name})` : this.name;
    const superStateNames = Array.from(this.superStates, (s) => `:${s.name}`);
    const entryActionNames = this.entryActions.map((a) => `<${a}`);
    const exitActionNames = this.exitActions.map((a) => `>${a}`);
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

export class SemanticTransition {
  public event: string | null = null;
  public nextState: SemanticState | null = null;
  public actions: string[] = [];
}
