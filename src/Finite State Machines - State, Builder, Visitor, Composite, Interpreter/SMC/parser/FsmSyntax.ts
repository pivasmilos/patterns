import { hash } from "../utilities";

export class Header {
  constructor(public name: string | null = null, public value: string | null = null) {}

  hashCode(): string {
    const name = this.name ?? "";
    const value = this.value ?? "";
    return hash(name + value);
  }

  equals({ name, value }: Header): boolean {
    return this.name === name && this.value === value;
  }
}

export class Transition {
  public state = new StateSpec();
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
    return `Syntax error: ${this.type}. ${this.msg}. line ${this.line}, position ${this.position}.\n`;
  }
}

export class FsmSyntax {
  constructor(
    public headers: Header[] = [],
    public logic: Transition[] = [],
    public errors: SyntaxError[] = [],
    public done = false
  ) {}

  public toString(): string {
    return `${this.formatHeaders()}${this.formatLogic()}${this.done ? ".\n" : ""}${this.getFirstError()}`;
  }

  public getError(): string {
    return this.getFirstError();
  }

  private formatHeaders(): string {
    return this.headers.map((h) => `${this.formatHeader(h)}\n`).join("");
  }

  private formatHeader({ name, value }: Header): string {
    return `${name}:${value}`;
  }

  private formatLogic(): string {
    if (this.logic.length === 0) {
      return "";
    }
    return `{\n${this.logic.map((t) => this.formatTransition(t)).join("")}}\n`;
  }

  private formatTransition({ state, subTransitions }: Transition): string {
    return `  ${this.formatStateName(state)} ${this.formatSubTransitions(subTransitions)}\n`;
  }

  private formatStateName({ name, isAbstractState, superStates, entryActions, exitActions }: StateSpec): string {
    const stateName = isAbstractState ? `(${name})` : name;
    const superStatesStr = superStates.map((superState) => `:${superState}`).join("");
    const entryActionsStr = entryActions.map((entryAction) => ` <${entryAction}`).join("");
    const exitActionsStr = exitActions.map((exitAction) => ` >${exitAction}`).join("");
    return stateName + superStatesStr + entryActionsStr + exitActionsStr;
  }

  private formatSubTransitions(subTransitions: SubTransition[]): string {
    if (subTransitions.length === 1) {
      const st = subTransitions[0];
      if (!st) {
        return "";
      }

      return this.formatSubTransition(st);
    }

    const subTransitionsStr = subTransitions.map((st) => `    ${this.formatSubTransition(st)}\n`).join("");
    return `{\n${subTransitionsStr}  }`;
  }

  private formatSubTransition({ event, nextState, actions }: SubTransition): string {
    return `${event} ${nextState} ${this.formatActions(actions)}`;
  }

  private formatActions(actions: string[]): string {
    const actionsStr = actions.join(" ");

    return actions.length === 1 ? actionsStr : `{${actionsStr}}`;
  }

  private getFirstError(): string {
    const firstError = this.errors[0];
    if (!firstError) {
      return "";
    }

    return this.formatError(firstError);
  }

  private formatError(error: SyntaxError): string {
    return error.toString();
  }
}
