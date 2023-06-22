import { hash } from "../utilities";

export class Header {
  constructor(public name: string | null = null, public value: string | null = null) {}

  hashCode(): string {
    const name = this.name ?? "";
    const value = this.value ?? "";
    return hash(name + value);
  }

  equals(other: Header): boolean {
    return this.name === other.name && this.value === other.value;
  }
}

export class Transition {
  public state: StateSpec = new StateSpec();
  public subTransitions: SubTransition[] = [];
}

export class StateSpec {
  public name = "";
  public superStates: string[] = [];
  public entryActions: string[] = [];
  public exitActions: string[] = [];
  public isAbstractState = false;
}

export class SubTransition {
  public event: string | null = null;
  public nextState: string | null = null;
  public actions: string[] = [];
}

export enum ErrorType {
  HEADER = "HEADER",
  STATE = "STATE",
  TRANSITION = "TRANSITION",
  TRANSITION_GROUP = "TRANSITION_GROUP",
  END = "END",
  SYNTAX = "SYNTAX",
}

export class SyntaxError {
  constructor(public type: ErrorType, public msg: string, public line: number, public position: number) {}

  public toString() {
    return `Syntax error: ${this.type.toString()}. ${this.msg}. line ${this.line}, position ${this.position}.\n`;
  }
}

export class FsmSyntax {
  constructor(
    public headers: Header[] = [],
    public logic: Transition[] = [],
    public errors: SyntaxError[] = [],
    public done: boolean = false
  ) {}

  public toString(): string {
    return this.formatHeaders() + this.formatLogic() + (this.done ? ".\n" : "") + this.getFirstError();
  }

  public getError(): string {
    return this.getFirstError();
  }

  private formatHeaders(): string {
    return this.headers.map((h) => this.formatHeader(h)).join("");
  }

  private formatHeader(h: Header): string {
    return `${h.name}:${h.value}\n`;
  }

  private formatLogic(): string {
    if (this.logic.length === 0) {
      return "";
    }
    return `{\n${this.formatTransitions()}}\n`;
  }

  private formatTransitions(): string {
    const transitions = this.logic.map((t) => this.formatTransition(t)).join("");
    return transitions;
  }

  private formatTransition(transition: Transition): string {
    return `  ${this.formatStateName(transition.state)} ${this.formatSubTransitions(transition)}\n`;
  }

  private formatStateName({ name, isAbstractState, superStates, entryActions, exitActions }: StateSpec): string {
    const stateName = isAbstractState ? `(${name})` : name;
    const superStatesStr = superStates.map((superState) => `:${superState}`).join("");
    const entryActionsStr = entryActions.map((entryAction) => ` <${entryAction}`).join("");
    const exitActionsStr = exitActions.map((exitAction) => ` >${exitAction}`).join("");
    return stateName + superStatesStr + entryActionsStr + exitActionsStr;
  }

  private formatSubTransitions(transition: Transition): string {
    if (transition.subTransitions.length === 1) {
      const st = transition.subTransitions[0];
      if (!st) {
        return "";
      }

      return this.formatSubTransition(st);
    }

    const subTransitions = transition.subTransitions.map((st) => `    ${this.formatSubTransition(st)}\n`).join("");
    return `{\n${subTransitions}  }`;
  }

  private formatSubTransition(subTransition: SubTransition): string {
    return `${subTransition.event} ${subTransition.nextState} ${this.formatActions(subTransition)}`;
  }

  private formatActions(subTransition: SubTransition): string {
    const actions = subTransition.actions.join(" ");

    return subTransition.actions.length === 1 ? actions : `{${actions}}`;
  }

  private getFirstError(): string {
    const firstError = this.errors[0];
    if (!firstError) {
      return "";
    }

    return this.formatError(firstError);
  }

  private formatError(e: SyntaxError): string {
    return e.toString();
  }
}
