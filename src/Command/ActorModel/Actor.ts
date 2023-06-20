import { Command } from "../Command";

/**
 * Keeps a commands queue and executes them one by one via run.
 */
export interface Actor {
  addCommand(command: Command): void;
  run(): void;
}
