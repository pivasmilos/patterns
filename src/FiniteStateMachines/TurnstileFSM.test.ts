import {
  ATurnstileState,
  StatePatternTurnstileFSM,
  TurnstileState,
} from "./StatePatternTurnstileFSM";
import { SwitchCaseTurnstileFSM } from "./SwitchCaseTurnstileFSM";
import { TableDrivenTurnstileFSM } from "./TableDrivenTurnstileFSM";
import {
  TurnstileWithState,
  Event,
  State,
  Action,
  Turnstile,
} from "./Turnstile";
import { TurnstileFSM } from "./TurnstileFSM";

class FsmTestHelper {
  public static getArgs(state: State): readonly [TurnstileWithState] {
    const turnstile: TurnstileWithState = {
      performAction: jest.fn(),
      state,
    };
    return [turnstile] as const;
  }

  public static getCurrentState(sut: TurnstileFSM): State {
    return sut.turnstile.state;
  }
}

class StatePatternFsmTestHelper {
  public static getArgs(state: State): readonly [Turnstile, TurnstileState] {
    const turnstile: Turnstile = {
      performAction: jest.fn(),
    };
    const initialState = ATurnstileState.stateMap[state];
    return [turnstile, initialState] as const;
  }

  public static getCurrentState(sut: StatePatternTurnstileFSM): State {
    return Object.keys(ATurnstileState.stateMap).find(
      (key) => ATurnstileState.stateMap[key as State] === sut.state
    ) as State;
  }
}

describe("Multiple TurnstileFSM implementations", () => {
  describe.each`
    TurnstileFSMClass           | TestHelper
    ${SwitchCaseTurnstileFSM}   | ${FsmTestHelper}
    ${TableDrivenTurnstileFSM}  | ${FsmTestHelper}
    ${StatePatternTurnstileFSM} | ${StatePatternFsmTestHelper}
  `(
    "$TurnstileFSMClass.name .handleEvent()",
    ({ TurnstileFSMClass, TestHelper }) => {
      describe.each`
        state             | event         | nextState         | action
        ${State.locked}   | ${Event.coin} | ${State.unlocked} | ${Action.unlock}
        ${State.locked}   | ${Event.pass} | ${State.locked}   | ${Action.alarm}
        ${State.unlocked} | ${Event.coin} | ${State.unlocked} | ${Action.thankyou}
        ${State.unlocked} | ${Event.pass} | ${State.locked}   | ${Action.lock}
      `(
        "given $state, when $event, then transition to $nextState and perform $action",
        ({ state, event, nextState, action }) => {
          it("transitions to expected state", () => {
            const constructorArgs = TestHelper.getArgs(state);
            const sut = new TurnstileFSMClass(...constructorArgs);

            sut.handleEvent(event);
            const currentState = TestHelper.getCurrentState(sut);

            expect(currentState).toBe(nextState);
          });

          it("performs the expected action", () => {
            const constructorArgs = TestHelper.getArgs(state);
            const turnstile = constructorArgs[0];
            const sut = new TurnstileFSMClass(...constructorArgs);

            sut.handleEvent(event);

            expect(turnstile.performAction).toHaveBeenCalledWith(action);
          });
        }
      );
    }
  );
});
