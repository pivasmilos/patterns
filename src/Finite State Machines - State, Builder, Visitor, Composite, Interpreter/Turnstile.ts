export interface Turnstile {
  performAction(action: Action): void;
}

export interface TurnstileWithState extends Turnstile {
  state: State;
}

export enum Action {
  lock = "lock",
  unlock = "unlock",
  alarm = "alarm",
  thankyou = "thankyou",
}

export enum Event {
  coin = "coin",
  pass = "pass",
}

export enum State {
  locked = "locked",
  unlocked = "unlocked",
}

export class InvalidTransitionError extends Error {
  constructor(from: State, event: Event) {
    super(`Invalid transition: ${from} -> ${event}`);
  }
}
