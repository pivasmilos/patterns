import { AnalysisError } from "./AnalysisError";
import { SemanticState } from "./SemanticState";

export class SemanticStateMachine {
  public errors: AnalysisError[] = [];
  public warnings: AnalysisError[] = [];
  public states = new Map<string, SemanticState>();
  public events = new Set<string>();
  public actions = new Set<string>();
  public initialState: SemanticState | null = null;
  public actionClass: string | null = null;
  public fsmName: string | null = null;

  public toString(): string {
    const { actionClass, fsmName, initialState } = this;
    return [
      `Actions: ${actionClass}`,
      `FSM: ${fsmName}`,
      `Initial: ${initialState?.name ?? null}`,
      this.statesToString(),
    ].join("\n");
  }

  public addError(analysisError: AnalysisError): void {
    this.errors.push(analysisError);
  }

  public statesToString(): string {
    const states = Array.from(this.states.values());
    return `{${states.join("")}}\n`;
  }
}
