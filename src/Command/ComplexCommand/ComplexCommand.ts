/**
 * However, some commands can delegate more complex operations to other objects,
 * called "receivers."
 */

import { Receiver } from "./Receiver";
import { Command } from "../Command";

/**
 * Takes some data but also delegates some processing to a Receiver.
 *
 * @see Receiver
 */
export class ComplexCommand implements Command {
  constructor(private readonly receiver: Receiver, private readonly receiverArgs: ReceiverArgs) {}

  public execute(): void {
    /**
     * Commands can delegate to any methods of a receiver.
     */
    console.log(
      "ComplexCommand: Complex stuff should be done by a receiver object."
    );
    this.receiver.doSomething(this.receiverArgs.a);
    this.receiver.doSomethingElse(this.receiverArgs.b);
  }
}

/**
 * Context data, required for launching the receiver's methods.
 */
export interface ReceiverArgs {
  a: string;
  b: string;
}
