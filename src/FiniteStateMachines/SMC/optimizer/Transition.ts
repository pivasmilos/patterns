import { SubTransition } from "./SubTransition";

export class Transition {
  constructor(public currentState?: string, public subTransitions: SubTransition[] = []) {}

  public toString(): string {
    const subTransitions = this.subTransitions.map((st) => st.toString());
    return [`${this.currentState} {\n`, ...subTransitions, "}\n"].join("");
  }
}
