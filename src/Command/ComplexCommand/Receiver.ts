/**
 * Example of a receiver class.
 *
 * Contains some important business logic.
 * Knows how to perform all kinds of operations associated with carrying out a request.
 *
 * In fact, any class may serve as a Receiver.
 */
export class Receiver {
  doSomething(s: string): void {
    console.log(`Receiver: Working on (${s}).`);
  }
  doSomethingElse(s: string): void {
    console.log(`Receiver: Also working on (${s}).`);
  }
}
