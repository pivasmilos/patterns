import { CodeGenerator } from "./CodeGenerator";
import { NSCNodeVisitor } from "./nestedSwitchCaseGenerator/NSCNodeVisitor";
import { JavaNestedSwitchCaseImplementer } from "../implementers/JavaNestedSwitchCaseImplementer";
import { OptimizedStateMachine } from "../optimizer/OptimizedStateMachine";
import * as fs from "fs";

export class JavaCodeGenerator extends CodeGenerator {
  private readonly implementer: JavaNestedSwitchCaseImplementer;

  constructor(
    optimizedStateMachine: OptimizedStateMachine,
    outputDirectory: string | undefined,
    flags: Map<string, string>
  ) {
    super(optimizedStateMachine, outputDirectory, flags);
    this.implementer = new JavaNestedSwitchCaseImplementer(flags);
  }

  protected getImplementer(): NSCNodeVisitor {
    return this.implementer;
  }

  public writeFiles(): void {
    const outputFileName = `${this.optimizedStateMachine.header.fsm}.java`;
    fs.writeFileSync(this.getOutputPath(outputFileName), this.implementer.getOutput());
  }
}
