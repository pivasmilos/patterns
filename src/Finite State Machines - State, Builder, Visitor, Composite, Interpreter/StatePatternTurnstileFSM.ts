import { Action, Event, State, Turnstile } from "./Turnstile";

export interface TurnstileFsmWithState {
  handleEvent(event: Event): void;
  state: TurnstileState;
  turnstile: Turnstile;
}

export interface TurnstileState {
  handleEvent(event: Event, turnstileFSM: TurnstileFsmWithState): void;
}

/**
 * Pros: easy to maintain as the number of states and events grows, faster than table driven approach
 *
 * Notice that we delegate the FSM logic to the state objects, and the actions to the Turnstile object.
 *
 * The state objects know when to execute actions (FSM logic) but they don't know how (mechanics).
 * The Turnstile object knows the mechanics, but doesn't know the FSM logic.
 *
 * This is a good example of the Single Responsibility Principle.
 */
export class StatePatternTurnstileFSM implements TurnstileFsmWithState {
  constructor(public turnstile: Turnstile, public state: TurnstileState) {}

  public handleEvent(event: Event) {
    this.state.handleEvent(event, this);
  }
}

type StateMap = Record<State, TurnstileState>;

export abstract class ATurnstileState implements TurnstileState {
  private static _stateMap: StateMap;

  // These are the State objects:
  static {
    const locked: ATurnstileState = {
      handleEvent(event: Event, turnstileFSM: TurnstileFsmWithState): void {
        switch (event) {
          case Event.coin:
            turnstileFSM.state = ATurnstileState._stateMap[State.unlocked];
            turnstileFSM.turnstile.performAction(Action.unlock);
            break;
          case Event.pass:
            turnstileFSM.turnstile.performAction(Action.alarm);
            break;
        }
      },
    };
    const unlocked: ATurnstileState = {
      handleEvent(event: Event, turnstileFSM: TurnstileFsmWithState): void {
        switch (event) {
          case Event.coin:
            turnstileFSM.turnstile.performAction(Action.thankyou);
            break;
          case Event.pass:
            turnstileFSM.state = ATurnstileState._stateMap[State.locked];
            turnstileFSM.turnstile.performAction(Action.lock);
            break;
        }
      },
    };

    ATurnstileState._stateMap = {
      [State.locked]: locked,
      [State.unlocked]: unlocked,
    };
  }

  static get stateMap(): StateMap {
    return ATurnstileState._stateMap;
  }

  abstract handleEvent(event: Event, turnstileFSM: TurnstileFsmWithState): void;
}
