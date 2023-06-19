/**
 * Some commands can implement simple operations on their own.
 */
import { Command } from "../Command";

/**
 * Takes some data and executes a simple command on it.
 */
export class SimpleCommand implements Command {
  constructor(private payload: string) {}

  public execute(): void {
    console.log(
      `SimpleCommand: See, I can do simple things like printing (${this.payload})`
    );
  }
}
