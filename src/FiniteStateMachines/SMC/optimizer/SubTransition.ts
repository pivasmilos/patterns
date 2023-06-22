export class SubTransition {
  constructor(public event: string, public nextState?: string, public actions: string[] = []) {}

  public toString(): string {
    return `  ${this.event} ${this.nextState} {${this.actionsString()}}\n`;
  }

  private actionsString(): string {
    return this.actions.join(" ");
  }
}
