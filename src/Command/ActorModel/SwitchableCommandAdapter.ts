import { Command } from "../Command";
import { Switchable } from "./Switchable";

export class SwitchableCommandAdapter implements Command {
  constructor(private switchable: Switchable) {}

  public execute(): void {
    this.switchable.turnOn();
  }
}
