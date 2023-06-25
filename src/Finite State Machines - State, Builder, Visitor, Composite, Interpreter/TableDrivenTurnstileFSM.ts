import { Action, Event, InvalidTransitionError, State, TurnstileWithState } from "./Turnstile";
import { TurnstileFSM } from "./TurnstileFSM";

/**
 * Pros: easy to maintain as the number of states and events grows
 * Cons: slower than switch-case because we have need to do a table search
 */
export class TableDrivenTurnstileFSM implements TurnstileFSM {
  private readonly transitionTable = [
    [State.locked, Event.coin, State.unlocked, (t: TurnstileWithState) => t.performAction(Action.unlock)],
    [State.locked, Event.pass, State.locked, (t: TurnstileWithState) => t.performAction(Action.alarm)],
    [State.unlocked, Event.coin, State.unlocked, (t: TurnstileWithState) => t.performAction(Action.thankyou)],
    [State.unlocked, Event.pass, State.locked, (t: TurnstileWithState) => t.performAction(Action.lock)],
  ] as const;

  private readonly transitions: Transition[] = this.transitionTable.map(
    ([from, event, to, action]) => new Transition(from, event, to, action)
  );

  constructor(public turnstile: TurnstileWithState) {}

  public handleEvent(event: Event) {
    const transition = this.transitions.find((t) => t.from === this.turnstile.state && t.event === event);

    if (!transition) {
      throw new InvalidTransitionError(this.turnstile.state, event);
    }

    this.turnstile.state = transition.to;
    transition.action(this.turnstile);
  }
}

export class Transition {
  constructor(
    public readonly from: State,
    public readonly event: Event,
    public readonly to: State,
    public readonly action: (t: TurnstileWithState) => void
  ) {}
}
