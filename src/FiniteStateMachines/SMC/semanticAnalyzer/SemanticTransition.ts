import { SemanticState } from "./SemanticState";

export class SemanticTransition {
  constructor(public event: string | null, public nextState: SemanticState | null, public actions: string[]) {}
}
