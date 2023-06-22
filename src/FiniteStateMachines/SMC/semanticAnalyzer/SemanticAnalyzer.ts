import { hash } from "../utilities";
import { FsmSyntax, Header, SubTransition, Transition } from "../parser/FsmSyntax";
import { SemanticStateMachine } from "./SemanticStateMachine";
import { SemanticState } from "./SemanticState";
import { SemanticTransition } from "./SemanticTransition";
import { AnalysisError, AnalysisErrorID } from "./AnalysisError";

export class SemanticAnalyzer {
  // non-null assertion is safe because analyze() is the only public method and it initializes this right away
  private semanticStateMachine!: SemanticStateMachine;
  private fsmHeader: Header = new Header();
  private actionsHeader: Header = new Header();
  private initialHeader: Header = new Header();

  public analyze(fsm: FsmSyntax): SemanticStateMachine {
    this.semanticStateMachine = new SemanticStateMachine();
    this.analyzeHeaders(fsm);
    this.checkSemanticValidity(fsm);
    this.produceSemanticStateMachine(fsm);
    return this.semanticStateMachine;
  }

  private analyzeHeaders(fsm: FsmSyntax): void {
    this.setHeaders(fsm);
    this.checkMissingHeaders();
  }

  private setHeaders(fsm: FsmSyntax): void {
    for (const header of fsm.headers) {
      if (this.isNamed(header, "fsm")) {
        this.setHeader(this.fsmHeader, header);
      } else if (this.isNamed(header, "actions")) {
        this.setHeader(this.actionsHeader, header);
      } else if (this.isNamed(header, "initial")) {
        this.setHeader(this.initialHeader, header);
      } else {
        this.semanticStateMachine.errors.push(new AnalysisError(AnalysisErrorID.INVALID_HEADER, header));
      }
    }
  }

  private isNamed(header: Header, headerName: string): boolean {
    return header.name?.toLowerCase() === headerName.toLowerCase();
  }

  private setHeader(targetHeader: Header, header: Header): void {
    if (this.isNullHeader(targetHeader)) {
      targetHeader.name = header.name;
      targetHeader.value = header.value;
    } else {
      this.semanticStateMachine.addError(new AnalysisError(AnalysisErrorID.EXTRA_HEADER_IGNORED, header));
    }
  }

  private checkMissingHeaders(): void {
    if (this.isNullHeader(this.fsmHeader)) {
      this.semanticStateMachine.addError(new AnalysisError(AnalysisErrorID.NO_FSM));
    }
    if (this.isNullHeader(this.initialHeader)) {
      this.semanticStateMachine.addError(new AnalysisError(AnalysisErrorID.NO_INITIAL));
    }
  }

  private isNullHeader(header: Header): boolean {
    return header.name === null;
  }

  private checkSemanticValidity(fsm: FsmSyntax): void {
    this.createStateEventAndActionLists(fsm);
    this.checkUndefinedStates(fsm);
    this.checkForUnusedStates(fsm);
    this.checkForDuplicateTransitions(fsm);
    this.checkThatAbstractStatesAreNotTargets(fsm);
    this.checkForInconsistentAbstraction(fsm);
    this.checkForMultiplyDefinedStateActions(fsm);
  }

  private createStateEventAndActionLists(fsm: FsmSyntax): void {
    this.addStateNamesToStateList(fsm);
    this.addEntryAndExitActionsToActionList(fsm);
    this.addEventsToEventList(fsm);
    this.addTransitionActionsToActionList(fsm);
  }

  private addTransitionActionsToActionList(fsm: FsmSyntax): void {
    for (const t of fsm.logic) {
      for (const st of t.subTransitions) {
        for (const action of st.actions) {
          this.semanticStateMachine.actions.add(action);
        }
      }
    }
  }

  private addEventsToEventList(fsm: FsmSyntax): void {
    for (const t of fsm.logic) {
      for (const st of t.subTransitions) {
        if (st.event !== null) {
          this.semanticStateMachine.events.add(st.event);
        }
      }
    }
  }

  private addEntryAndExitActionsToActionList(fsm: FsmSyntax): void {
    for (const t of fsm.logic) {
      for (const entryAction of t.state.entryActions) {
        this.semanticStateMachine.actions.add(entryAction);
      }
      for (const exitAction of t.state.exitActions) {
        this.semanticStateMachine.actions.add(exitAction);
      }
    }
  }

  private addStateNamesToStateList(fsm: FsmSyntax): void {
    for (const t of fsm.logic) {
      const state = new SemanticState(t.state.name);
      this.semanticStateMachine.states.set(state.name, state);
    }
  }

  private checkUndefinedStates(fsm: FsmSyntax): void {
    for (const t of fsm.logic) {
      for (const superState of t.state.superStates) {
        this.checkUndefinedState(superState, AnalysisErrorID.UNDEFINED_SUPER_STATE);
      }
      for (const st of t.subTransitions) {
        this.checkUndefinedState(st.nextState, AnalysisErrorID.UNDEFINED_STATE);
      }
    }

    if (this.initialHeader.value !== null && !this.semanticStateMachine.states.has(this.initialHeader.value)) {
      this.semanticStateMachine.addError(
        new AnalysisError(AnalysisErrorID.UNDEFINED_STATE, `initial: ${this.initialHeader.value}`)
      );
    }
  }

  private checkUndefinedState(referencedState: string | null, errorCode: AnalysisErrorID): void {
    if (referencedState !== null && !this.semanticStateMachine.states.has(referencedState)) {
      this.semanticStateMachine.addError(new AnalysisError(errorCode, referencedState));
    }
  }

  private checkForUnusedStates(fsm: FsmSyntax): void {
    this.findStatesDefinedButNotUsed(this.findUsedStates(fsm));
  }

  private findStatesDefinedButNotUsed(usedStates: Set<string>): void {
    for (const definedState of this.semanticStateMachine.states.keys()) {
      if (!usedStates.has(definedState)) {
        this.semanticStateMachine.addError(new AnalysisError(AnalysisErrorID.UNUSED_STATE, definedState));
      }
    }
  }

  private findUsedStates(fsm: FsmSyntax): Set<string> {
    const usedStates = new Set<string>();
    if (this.initialHeader.value) {
      usedStates.add(this.initialHeader.value);
    }
    this.getSuperStates(fsm).forEach((s) => usedStates.add(s));
    this.getNextStates(fsm).forEach((s) => usedStates.add(s));
    return usedStates;
  }

  private getNextStates(fsm: FsmSyntax): Set<string> {
    const nextStates = new Set<string>();
    for (const t of fsm.logic) {
      for (const st of t.subTransitions) {
        if (st.nextState === null) {
          nextStates.add(t.state.name);
        } else {
          nextStates.add(st.nextState);
        }
      }
    }
    return nextStates;
  }

  private getSuperStates(fsm: FsmSyntax): Set<string> {
    const superStates = new Set<string>();
    for (const t of fsm.logic) {
      for (const superState of t.state.superStates) {
        superStates.add(superState);
      }
    }
    return superStates;
  }

  private checkForDuplicateTransitions(fsm: FsmSyntax): void {
    const transitionKeys = new Set<string>();
    for (const t of fsm.logic) {
      for (const st of t.subTransitions) {
        const key = `${t.state.name}(${st.event})`;
        if (transitionKeys.has(key)) {
          this.semanticStateMachine.addError(new AnalysisError(AnalysisErrorID.DUPLICATE_TRANSITION, key));
        } else {
          transitionKeys.add(key);
        }
      }
    }
  }

  private checkThatAbstractStatesAreNotTargets(fsm: FsmSyntax): void {
    const abstractStates = this.findAbstractStates(fsm);
    for (const t of fsm.logic) {
      for (const st of t.subTransitions) {
        if (st.nextState && abstractStates.has(st.nextState)) {
          const error = new AnalysisError(
            AnalysisErrorID.ABSTRACT_STATE_USED_AS_NEXT_STATE,
            `${t.state.name}(${st.event})->${st.nextState}`
          );
          this.semanticStateMachine.addError(error);
        }
      }
    }
  }

  private findAbstractStates(fsm: FsmSyntax): Set<string> {
    const abstractStates = new Set<string>();
    for (const t of fsm.logic) {
      if (t.state.isAbstractState) {
        abstractStates.add(t.state.name);
      }
    }
    return abstractStates;
  }

  private checkForInconsistentAbstraction(fsm: FsmSyntax): void {
    const abstractStates = this.findAbstractStates(fsm);
    for (const t of fsm.logic) {
      if (!t.state.isAbstractState && abstractStates.has(t.state.name)) {
        const error = new AnalysisError(AnalysisErrorID.INCONSISTENT_ABSTRACTION, t.state.name);
        this.semanticStateMachine.warnings.push(error);
      }
    }
  }

  private checkForMultiplyDefinedStateActions(fsm: FsmSyntax): void {
    const firstActionsForState = new Map<string, string>();
    for (const t of fsm.logic) {
      if (this.specifiesStateActions(t)) {
        const actionsKey = this.makeActionsKey(t);
        if (firstActionsForState.has(t.state.name)) {
          if (firstActionsForState.get(t.state.name) !== actionsKey) {
            const error = new AnalysisError(AnalysisErrorID.STATE_ACTIONS_MULTIPLY_DEFINED, t.state.name);
            this.semanticStateMachine.addError(error);
          }
        } else {
          firstActionsForState.set(t.state.name, actionsKey);
        }
      }
    }
  }

  private specifiesStateActions(t: Transition): boolean {
    return t.state.entryActions.length !== 0 || t.state.exitActions.length !== 0;
  }

  private makeActionsKey(t: Transition): string {
    const actions: string[] = [];
    actions.push(...t.state.entryActions);
    actions.push(...t.state.exitActions);
    return this.commaList(actions);
  }

  private commaList(list: string[]): string {
    let commaList = "";
    if (list.length === 0) {
      return "";
    }
    for (const s of list) {
      commaList += s + ",";
    }
    return commaList.substring(0, commaList.length - 1);
  }

  private produceSemanticStateMachine(fsm: FsmSyntax): void {
    if (this.semanticStateMachine.errors.length === 0) {
      this.compileHeaders();
      for (const t of fsm.logic) {
        const state = this.compileState(t);

        if (!state) {
          continue;
        }

        this.compileTransitions(t, state);
      }

      new SuperClassCrawler(this.semanticStateMachine).checkSuperClassTransitions();
    }
  }

  private compileHeaders(): void {
    this.semanticStateMachine.initialState = this.initialHeader.value
      ? this.semanticStateMachine.states.get(this.initialHeader.value) ?? null
      : null;
    this.semanticStateMachine.actionClass = this.actionsHeader.value;
    this.semanticStateMachine.fsmName = this.fsmHeader.value;
  }

  private compileState(t: Transition): SemanticState | null {
    const state = this.semanticStateMachine.states.get(t.state.name);

    if (!state) {
      return null;
    }

    state.entryActions.push(...t.state.entryActions);
    state.exitActions.push(...t.state.exitActions);
    state.isAbstractState ||= t.state.isAbstractState;
    for (const superStateName of t.state.superStates) {
      const superState = this.semanticStateMachine.states.get(superStateName);

      if (!superState) {
        continue;
      }

      state.superStates.add(superState);
    }
    return state;
  }

  private compileTransitions(t: Transition, state: SemanticState): void {
    for (const st of t.subTransitions) {
      this.compileTransition(state, st);
    }
  }

  private compileTransition(state: SemanticState, st: SubTransition): void {
    const nextState = st.nextState === null ? state : this.semanticStateMachine.states.get(st.nextState) ?? null;
    const semanticTransition = new SemanticTransition(st.event, nextState, st.actions);
    state.transitions.push(semanticTransition);
  }
}

class SuperClassCrawler {
  private concreteState: SemanticState | null = null;

  constructor(
    private semanticStateMachine: SemanticStateMachine,
    private transitionTuples: Map<string, TransitionTuple> = new Map()
  ) {}

  public checkSuperClassTransitions(): void {
    for (const state of this.semanticStateMachine.states.values()) {
      if (!state.isAbstractState) {
        this.concreteState = state;
        this.transitionTuples = new Map();
        this.checkTransitionsForState(this.concreteState);
      }
    }
  }

  private checkTransitionsForState(state: SemanticState): void {
    for (const superState of state.superStates) {
      this.checkTransitionsForState(superState);
    }
    this.checkStateForPreviouslyDefinedTransition(state);
  }

  private checkStateForPreviouslyDefinedTransition(state: SemanticState): void {
    for (const st of state.transitions) {
      this.checkTransitionForPreviousDefinition(state, st);
    }
  }

  private checkTransitionForPreviousDefinition(state: SemanticState, st: SemanticTransition): void {
    const thisTuple = new TransitionTuple(state.name, st.event ?? "", st.nextState?.name ?? "", st.actions);
    if (this.transitionTuples.has(thisTuple.event)) {
      this.determineIfThePreviousDefinitionIsAnError(state, thisTuple);
    } else {
      this.transitionTuples.set(thisTuple.event, thisTuple);
    }
  }

  private determineIfThePreviousDefinitionIsAnError(state: SemanticState, thisTuple: TransitionTuple): void {
    const previousTuple = this.transitionTuples.get(thisTuple.event);

    if (!this.transitionsHaveSameOutcomes(thisTuple, previousTuple)) {
      this.checkForOverriddenTransition(state, thisTuple, previousTuple);
    }
  }

  private transitionsHaveSameOutcomes(t1: TransitionTuple | undefined, t2: TransitionTuple | undefined): boolean {
    return (
      t1 !== undefined &&
      t2 !== undefined &&
      t1.nextState === t2.nextState &&
      JSON.stringify(t1.actions) === JSON.stringify(t2.actions)
    );
  }

  private checkForOverriddenTransition(
    state: SemanticState,
    thisTuple: TransitionTuple,
    previousTuple: TransitionTuple | undefined
  ): void {
    const definingState = previousTuple ? this.semanticStateMachine.states.get(previousTuple.currentState) : null;
    if (!(definingState && state.isSuperStateOf(definingState))) {
      this.semanticStateMachine.addError(
        new AnalysisError(AnalysisErrorID.CONFLICTING_SUPERSTATES, `${this.concreteState?.name}|${thisTuple.event}`)
      );
    } else {
      this.transitionTuples.set(thisTuple.event, thisTuple);
    }
  }
}

class TransitionTuple {
  constructor(public currentState: string, public event: string, public nextState: string, public actions: string[]) {}

  public hashCode(): string {
    return hash(this.currentState + this.event + this.nextState + this.actions);
  }

  public equals(tt: TransitionTuple): boolean {
    return (
      this.currentState === tt.currentState &&
      this.event === tt.event &&
      this.nextState === tt.nextState &&
      JSON.stringify(this.actions) === JSON.stringify(tt.actions)
    );
  }
}
