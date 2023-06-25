import { State, TurnstileWithState, Event, Action } from "./Turnstile";
import { TurnstileFSM } from "./TurnstileFSM";

/**
 * Pros: very fast, probably easy to implement at first
 * Cons: hard to maintain as the number of states and events grows
 */
export class SwitchCaseTurnstileFSM implements TurnstileFSM {
  constructor(public turnstile: TurnstileWithState) {}

  public handleEvent(event: Event) {
    switch (this.turnstile.state) {
      case State.locked:
        switch (event) {
          case Event.coin:
            this.turnstile.state = State.unlocked;
            this.turnstile.performAction(Action.unlock);
            break;
          case Event.pass:
            this.turnstile.performAction(Action.alarm);
            break;
        }
        break;
      case State.unlocked:
        switch (event) {
          case Event.coin:
            this.turnstile.performAction(Action.thankyou);
            break;
          case Event.pass:
            this.turnstile.state = State.locked;
            this.turnstile.performAction(Action.lock);
            break;
        }
        break;
    }
  }
}
