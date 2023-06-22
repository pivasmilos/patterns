import { SemanticStateMachine } from "../semanticAnalyzer/SemanticStateMachine";
import { SemanticState } from "../semanticAnalyzer/SemanticState";
import { SemanticTransition } from "../semanticAnalyzer/SemanticTransition";
import { OptimizedStateMachine } from "./OptimizedStateMachine";
import { Header } from "./Header";
import { Transition } from "./Transition";
import { SubTransition } from "./SubTransition";

export class Optimizer {
  // non null assertions are ok because the values are set right away in the optimize method
  private optimizedStateMachine!: OptimizedStateMachine;
  private semanticStateMachine!: SemanticStateMachine;

  public optimize(ast: SemanticStateMachine): OptimizedStateMachine {
    this.semanticStateMachine = ast;
    this.optimizedStateMachine = new OptimizedStateMachine();
    this.addHeader();
    this.addLists();
    this.addTransitions();
    return this.optimizedStateMachine;
  }

  private addHeader(): void {
    const { fsmName, initialState, actionClass } = this.semanticStateMachine;
    this.optimizedStateMachine.header = new Header(fsmName ?? "", initialState?.name ?? "", actionClass ?? "");
  }

  private addLists(): void {
    this.addStates();
    this.addEvents();
    this.addActions();
  }

  private addTransitions(): void {
    for (const s of this.semanticStateMachine.states.values())
      if (!s.isAbstractState) {
        new StateOptimizer(s, this.optimizedStateMachine).addTransitionsForState();
      }
  }

  private addStates(): void {
    for (const s of this.semanticStateMachine.states.values())
      if (!s.isAbstractState) this.optimizedStateMachine.states.push(s.name);
  }

  private addEvents(): void {
    this.optimizedStateMachine.events.push(...Array.from(this.semanticStateMachine.events));
  }

  private addActions(): void {
    this.optimizedStateMachine.actions.push(...Array.from(this.semanticStateMachine.actions));
  }

  public static addAllStatesInHierarchyLeafFirst(state: SemanticState, hierarchy: SemanticState[]): void {
    for (const s of state.superStates)
      if (!hierarchy.includes(s)) Optimizer.addAllStatesInHierarchyLeafFirst(s, hierarchy);
    hierarchy.push(state);
  }
}

class StateOptimizer {
  constructor(
    private currentState: SemanticState,
    private optimizedStateMachine: OptimizedStateMachine,
    private eventsForThisState: Set<string> = new Set()
  ) {}

  public addTransitionsForState(): void {
    const transition = new Transition(this.currentState.name);
    this.addSubTransitions(transition);
    this.optimizedStateMachine.transitions.push(transition);
  }

  private addSubTransitions(transition: Transition): void {
    for (const stateInHierarchy of this.makeRootFirstHierarchyOfStates()) {
      this.addStateTransitions(transition, stateInHierarchy);
    }
  }

  private makeRootFirstHierarchyOfStates(): SemanticState[] {
    const hierarchy: SemanticState[] = [];
    Optimizer.addAllStatesInHierarchyLeafFirst(this.currentState, hierarchy);
    hierarchy.reverse();
    return hierarchy;
  }

  private addStateTransitions(transition: Transition, state: SemanticState): void {
    state.transitions
      .filter((t) => this.eventExistsAndHasNotBeenOverridden(t.event))
      .forEach((t) => this.addSubTransition(t, transition));
  }

  private eventExistsAndHasNotBeenOverridden(event: string | null): boolean {
    return event !== null && !this.eventsForThisState.has(event);
  }

  private addSubTransition(semanticTransition: SemanticTransition, transition: Transition): void {
    this.eventsForThisState.add(semanticTransition.event ?? "");
    const subTransition = new SubTransition(semanticTransition.event ?? "");
    new SubTransitionOptimizer(semanticTransition, subTransition, this.currentState).optimize();
    transition.subTransitions.push(subTransition);
  }
}

class SubTransitionOptimizer {
  constructor(
    private semanticTransition: SemanticTransition,
    private subTransition: SubTransition,
    private currentState: SemanticState
  ) {}

  public optimize(): void {
    this.subTransition.event = this.semanticTransition.event ?? "";
    this.subTransition.nextState = this.semanticTransition.nextState?.name ?? "";

    this.addExitActions(this.currentState);

    if (this.semanticTransition.nextState) {
      this.addEntryActions(this.semanticTransition.nextState);
    }

    this.subTransition.actions.push(...this.semanticTransition.actions);
  }

  private addEntryActions(entryState: SemanticState): void {
    const hierarchy: SemanticState[] = [];
    Optimizer.addAllStatesInHierarchyLeafFirst(entryState, hierarchy);

    for (const superState of hierarchy) {
      this.subTransition.actions.push(...superState.entryActions);
    }
  }

  private addExitActions(exitState: SemanticState): void {
    const hierarchy: SemanticState[] = [];
    Optimizer.addAllStatesInHierarchyLeafFirst(exitState, hierarchy);
    hierarchy.reverse();
    for (const superState of hierarchy) {
      this.subTransition.actions.push(...superState.exitActions);
    }
  }
}
