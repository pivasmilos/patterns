import { Command } from "../Command";
import { Actor } from "./Actor";

export class CommandsActor implements Actor {
  private commands: Command[] = [];

  public addCommand(command: Command): void {
    this.commands.push(command);
  }

  public run(): void {
    while (this.commands.length) {
      const command = this.commands.shift();
      console.log("CommandsActor: executing command...");
      command?.execute();
    }
  }
}
