import path from "path";
import { OptimizedStateMachine } from "../optimizer/OptimizedStateMachine";
import { NSCGenerator } from "./nestedSwitchCaseGenerator/NSCGenerator";
import { NSCNodeVisitor } from "./nestedSwitchCaseGenerator/NSCNodeVisitor";

export abstract class CodeGenerator {
  protected readonly optimizedStateMachine: OptimizedStateMachine;
  protected readonly outputDirectory: string | undefined;
  protected readonly flags: Map<string, string>;

  constructor(
    optimizedStateMachine: OptimizedStateMachine,
    outputDirectory: string | undefined,
    flags: Map<string, string>
  ) {
    this.optimizedStateMachine = optimizedStateMachine;
    this.outputDirectory = outputDirectory;
    this.flags = flags;
  }

  protected getOutputPath(outputFileName: string): string {
    let outputPath: string;
    if (this.outputDirectory === undefined) {
      outputPath = path.join(outputFileName);
    } else {
      outputPath = path.join(this.outputDirectory, outputFileName);
    }
    return outputPath;
  }

  public generate(): void {
    const nscGenerator = new NSCGenerator();
    nscGenerator.generate(this.optimizedStateMachine).accept(this.getImplementer());
    this.writeFiles();
  }

  protected abstract getImplementer(): NSCNodeVisitor;

  public abstract writeFiles(): void;
}
