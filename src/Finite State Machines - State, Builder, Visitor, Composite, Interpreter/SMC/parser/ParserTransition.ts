import { Builder } from "./Builder";
import { ParserEvent as PE } from "./ParserEvent";
import { ParserState as PS } from "./ParserState";

export class ParserTransition {
  constructor(
    public currentState: PS,
    public event: PE,
    public newState: PS,
    public action: ((t: Builder) => void) | null
  ) {}
}
