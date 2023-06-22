import { NSCNodeVisitor } from "./NSCNodeVisitor";

export interface NSCNode {
  accept(visitor: NSCNodeVisitor): void;
}

export class SwitchCaseNode implements NSCNode {
  constructor(public variableName: string, public caseNodes: NSCNode[] = []) {
    this.variableName = variableName;
  }

  public accept(visitor: NSCNodeVisitor): void {
    visitor.visit(this);
  }

  public generateCases(visitor: NSCNodeVisitor): void {
    for (const c of this.caseNodes) {
      c.accept(visitor);
    }
  }
}

export class CaseNode implements NSCNode {
  constructor(public switchName: string, public caseName: string, public caseActionNode: NSCNode | null = null) {}

  public accept(visitor: NSCNodeVisitor): void {
    visitor.visit(this);
  }
}

export class FunctionCallNode implements NSCNode {
  constructor(public functionName: string, public argument?: NSCNode) {}

  public accept(visitor: NSCNodeVisitor): void {
    visitor.visit(this);
  }
}

export class CompositeNode implements NSCNode {
  private nodes: NSCNode[] = [];

  public accept(visitor: NSCNodeVisitor): void {
    for (const node of this.nodes) {
      node.accept(visitor);
    }
  }

  public add(node: NSCNode): void {
    this.nodes.push(node);
  }
}

export class EnumNode implements NSCNode {
  constructor(public name: string, public enumerators: string[]) {}

  public accept(visitor: NSCNodeVisitor): void {
    visitor.visit(this);
  }
}

export class StatePropertyNode implements NSCNode {
  constructor(public initialState: string) {}

  public accept(visitor: NSCNodeVisitor): void {
    visitor.visit(this);
  }
}

export class EventDelegatorsNode implements NSCNode {
  constructor(public readonly events: string[]) {}

  public accept(visitor: NSCNodeVisitor): void {
    visitor.visit(this);
  }
}

export class FSMClassNode implements NSCNode {
  public delegators: EventDelegatorsNode | null = null;
  public eventEnum: EnumNode | null = null;
  public stateEnum: EnumNode | null = null;
  public stateProperty: StatePropertyNode | null = null;
  public handleEvent: HandleEventNode | null = null;
  public className: string | null = null;
  public actionsName: string | null = null;
  public actions: string[] = [];

  public accept(visitor: NSCNodeVisitor): void {
    visitor.visit(this);
  }
}

export class HandleEventNode implements NSCNode {
  constructor(public readonly switchCase: SwitchCaseNode) {}

  public accept(visitor: NSCNodeVisitor): void {
    visitor.visit(this);
  }
}

export class EnumeratorNode implements NSCNode {
  constructor(public readonly enumeration: string, public readonly enumerator: string) {}

  public accept(visitor: NSCNodeVisitor): void {
    visitor.visit(this);
  }
}

export class DefaultCaseNode implements NSCNode {
  constructor(public readonly state: string) {}

  public accept(visitor: NSCNodeVisitor): void {
    visitor.visit(this);
  }
}
