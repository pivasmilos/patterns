import { hash } from "../utilities";

export class AnalysisError {
  public constructor(public id: AnalysisErrorID, public extra?: unknown) {}

  public toString(): string {
    return `Semantic Error: ${this.id}(${this.extra})`;
  }

  public hashCode(): string {
    const extra = this.extra?.toString() ?? "";
    return hash(this.id + extra);
  }

  public equals(obj: AnalysisError): boolean {
    return this.id === obj.id && this.extra === obj.extra;
  }
}

export enum AnalysisErrorID {
  NO_FSM = "NO_FSM",
  NO_INITIAL = "NO_INITIAL",
  INVALID_HEADER = "INVALID_HEADER",
  EXTRA_HEADER_IGNORED = "EXTRA_HEADER_IGNORED",
  UNDEFINED_STATE = "UNDEFINED_STATE",
  UNDEFINED_SUPER_STATE = "UNDEFINED_SUPER_STATE",
  UNUSED_STATE = "UNUSED_STATE",
  DUPLICATE_TRANSITION = "DUPLICATE_TRANSITION",
  ABSTRACT_STATE_USED_AS_NEXT_STATE = "ABSTRACT_STATE_USED_AS_NEXT_STATE",
  INCONSISTENT_ABSTRACTION = "INCONSISTENT_ABSTRACTION",
  STATE_ACTIONS_MULTIPLY_DEFINED = "STATE_ACTIONS_MULTIPLY_DEFINED",
  CONFLICTING_SUPERSTATES = "CONFLICTING_SUPERSTATES",
}
