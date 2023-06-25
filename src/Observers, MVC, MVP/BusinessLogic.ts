export interface BusinessLogic {
  // the message should really be of a generic type, but I didn't bother here.
  // + it's actually a bit easier to read the demos without all <T> stuff.
  setMessage(message: string): void;
  getMessage(): string;
}
