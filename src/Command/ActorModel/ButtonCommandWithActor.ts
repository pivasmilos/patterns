import { Command } from "../Command";
import { Actor } from "./Actor";
import { ButtonCode, ButtonsListener } from "./ButtonsListener";
import { Switchable } from "./Switchable";
import { SwitchableCommandAdapter } from "./SwitchableCommandAdapter";

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
    private buttonCode: ButtonCode,
    private switchable: Switchable
  ) {}

  public execute(): void {
    this.actor.addCommand(
      this.buttonHasBeenPressed()
        ? new SwitchableCommandAdapter(this.switchable)
        : this
    );
  }

  private buttonHasBeenPressed(): boolean {
    console.log(
      `ButtonCommand: checking if button ${this.buttonCode} has been pressed...`
    );

    return this.buttonListener.isPressed(this.buttonCode);
  }
}
