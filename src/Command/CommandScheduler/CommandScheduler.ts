import { Command } from "../Command";
import { Schedule } from "./Schedule";
import { TimeScheduler } from "./TimeScheduler";

/**
 * Executes commands on a given schedule.
 */
export class CommandScheduler implements Command {
  constructor(
    private readonly schedule: Schedule,
    private readonly commands: Command[],
    private readonly timeScheduler: TimeScheduler
  ) {}

  public execute(): void {
    console.log(
      `CommandScheduler: will be executing commands at ${this.schedule.executionTime}`
    );

    this.timeScheduler.scheduledCall(() => {
      this.commands.forEach((command) => command.execute());
    }, this.schedule.executionTime);
  }
}
