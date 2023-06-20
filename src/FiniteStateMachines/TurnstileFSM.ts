import { Event, TurnstileWithState } from "./Turnstile";

export interface TurnstileFSM {
  handleEvent(event: Event): void;
  turnstile: TurnstileWithState;
}
