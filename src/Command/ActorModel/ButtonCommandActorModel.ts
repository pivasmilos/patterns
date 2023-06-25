import { Command } from "../Command";

export interface Switchable {
  turnOn(): void;
  turnOff(): void;
}

export interface ButtonsListener {
  isPressed(string: string): boolean;
}

/**
 * Keeps a commands queue and executes them one by one via run.
 */
export interface Actor {
  addCommand(command: Command): void;
  run(): void;
}

/**
 * Together with an Actor, this implements an actor model with run-to completion scheduling.
 *
 * The button command adds itself to the actor's queue until the button has been pressed.
 *
 * When the button is pressed, the command adds a SwitchableCommandAdapter to the actor's queue to turn on the given switchable.
 *
 * This emulates having multiple threads, each with their own queue of commands.
 *
 * Notice that the ButtonCommandWithActor does not know how to:
 * - add a command to the actor's queue
 * - listen to the button
 * - turn on the switchable
 *
 * These responsibilities are delegated to:
 @see Actor
 @see ButtonsListener
 @see SwitchableCommandAdapter
 */
export class ButtonCommandWithActor implements Command {
  constructor(
    private actor: Actor,
    private buttonListener: ButtonsListener,
    private string: string,
    private switchable: Switchable
  ) {}

  public execute(): void {
    this.actor.addCommand(this.buttonHasBeenPressed() ? new SwitchableCommandAdapter(this.switchable) : this);
  }

  private buttonHasBeenPressed(): boolean {
    console.log(`ButtonCommand: checking if button ${this.string} has been pressed...`);

    return this.buttonListener.isPressed(this.string);
  }
}

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

export class SwitchableCommandAdapter implements Command {
  constructor(private switchable: Switchable) {}

  public execute(): void {
    this.switchable.turnOn();
  }
}

export class Light implements Switchable {
  constructor(private label: string = "") {}

  turnOn(): void {
    console.log(`SimpleLight: Light is on! Label: ${this.label}`);
  }

  turnOff(): void {
    console.log(`SimpleLight: Light is off! Label: ${this.label}`);
  }
}
