import { Header } from "./Header";
import { Transition } from "./Transition";

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
