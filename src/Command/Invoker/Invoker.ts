import { Command } from "../Command";

export interface InvokerCommands {
  onStart: Command;
  onFinish: Command;
}

/**
 * The Invoker is associated with one or several commands. It sends a request to
 * the command.
 */
export class Invoker implements Command {
  private commands: InvokerCommands | undefined;

  public registerCommands(commands: InvokerCommands): void {
    this.commands = commands;
  }

  /**
   * The Invoker does not depend on concrete command or receiver classes. The
   * Invoker passes a request to a receiver indirectly, by executing a
   * command.
   *
   * Notice that Invoker itself can be a command object.
   */
  public execute(): void {
    if (!this.commands) {
      throw new UnregisteredCommandsError();
    }

    console.log("Invoker: ...doing something really important...");
    this.commands.onStart.execute();
    this.commands.onFinish.execute();
  }
}

export class UnregisteredCommandsError extends Error {
  constructor() {
    super("Invoker: please register commands before executing.");
  }
}
