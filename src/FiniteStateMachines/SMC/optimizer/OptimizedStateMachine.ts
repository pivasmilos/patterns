export class OptimizedStateMachine {
  public states: string[] = [];
  public events: string[] = [];
  public actions: string[] = [];
  public header!: Header;
  public transitions: Transition[] = [];

  public transitionsToString(): string {
    let result = "";
    for (const t of this.transitions) {
      result += t.toString();
    }
    return result;
  }

  public toString(): string {
    const searchAllNewLines = /\n/g;
    let transitionsString = this.transitionsToString().replace(searchAllNewLines, "\n  ");
    transitionsString = transitionsString.substring(0, transitionsString.length - 2);
    return `Initial: ${this.header.initial}\nFsm: ${this.header.fsm}\nActions:${this.header.actions}\n{\n  ${transitionsString}}\n`;
  }
}

export class Header {
  constructor(public fsm?: string, public initial?: string, public actions?: string) {}
}

export class Transition {
  constructor(public currentState?: string, public subTransitions: SubTransition[] = []) {}

  public toString(): string {
    const subTransitions = this.subTransitions.map((st) => st.toString());
    return [`${this.currentState} {\n`, ...subTransitions, "}\n"].join("");
  }
}

export class SubTransition {
  constructor(public event: string, public nextState?: string, public actions: string[] = []) {}

  public toString(): string {
    return `  ${this.event} ${this.nextState} {${this.actionsString()}}\n`;
  }

  private actionsString(): string {
    return this.actions.join(" ");
  }
}
