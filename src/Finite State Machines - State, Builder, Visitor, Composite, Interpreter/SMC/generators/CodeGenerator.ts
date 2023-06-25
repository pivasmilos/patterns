import path from "path";
import { OptimizedStateMachine } from "../optimizer/OptimizedStateMachine";
import { NSCGenerator } from "./nestedSwitchCaseGenerator/NSCGenerator";
import { NSCNodeVisitor } from "./nestedSwitchCaseGenerator/NSCNodeVisitor";

export abstract class CodeGenerator {
  constructor(
    protected readonly optimizedStateMachine: OptimizedStateMachine,
    protected readonly outputDirectory: string | undefined,
    protected readonly flags: Map<string, string>
  ) {}

  protected getOutputPath(outputFileName: string): string {
    return !this.outputDirectory ? path.join(outputFileName) : path.join(this.outputDirectory, outputFileName);
  }

  public generate(): void {
    const nscGenerator = new NSCGenerator();
    nscGenerator.generate(this.optimizedStateMachine).accept(this.getImplementer());
    this.writeFiles();
  }

  protected abstract getImplementer(): NSCNodeVisitor;

  public abstract writeFiles(): void;
}
