import yargs from "yargs";
import { CodeGenerator } from "./generators/CodeGenerator";
import { codeGenerators } from "./generators/CodeGenerators";
import { Lexer } from "./lexer/Lexer";
import { OptimizedStateMachine } from "./optimizer/OptimizedStateMachine";
import { Optimizer } from "./optimizer/Optimizer";
import { FsmSyntax } from "./parser/FsmSyntax";
import { Parser } from "./parser/Parser";
import { SyntaxBuilder } from "./parser/SyntaxBuilder";
import { SemanticAnalyzer } from "./semanticAnalyzer/SemanticAnalyzer";
import * as fs from "fs";

type Flags = Map<string, string>;

export function main(args: string[]): void {
  const options = yargs(args)
    .option("file", {
      alias: "file",
      describe: "File to compile",
      type: "string",
      demandOption: true,
    })
    .option("o", {
      alias: "output",
      describe: "Output directory",
      type: "string",
    })
    .option("l", {
      alias: "language",
      describe: "Target language",
      type: "string",
      choices: ["Java"],
      default: "Java",
    })
    .option("f", {
      alias: "flags",
      describe: "Compiler flags",
      type: "string",
      array: true,
      default: [],
    })
    .help()
    .alias("h", "help")
    .parseSync();

  const file = options.file;
  const outputDirectory = options.o;
  const language = options.l;
  const flags = options.f;

  new SmcCompiler(file, outputDirectory, language, flags).run();
}

class SmcCompiler {
  private file: string;
  private outputDirectory: string | undefined = undefined;
  private language = "Java";
  private flags: Flags = new Map();
  private syntaxBuilder: SyntaxBuilder = new SyntaxBuilder();
  private parser: Parser = new Parser(this.syntaxBuilder);
  private lexer: Lexer = new Lexer(this.parser);

  constructor(file: string, outputDirectory: string | undefined, language: string, flags: string[]) {
    this.file = file;
    this.outputDirectory = outputDirectory;
    this.language = language;
    for (const flag of flags) {
      const [key, value] = flag.split("=");
      if (!key || !value) {
        continue;
      }
      this.flags.set(key, value);
    }
  }

  public run(): void {
    const smContent = this.getSourceCode();
    const fsm = this.compile(smContent);
    const syntaxErrorCount = this.reportSyntaxErrors(fsm);

    if (syntaxErrorCount === 0) {
      this.generateCode(this.optimize(fsm));
    }
  }

  private compile(smContent: string): FsmSyntax {
    this.syntaxBuilder = new SyntaxBuilder();
    this.parser = new Parser(this.syntaxBuilder);
    this.lexer = new Lexer(this.parser);
    this.lexer.lex(smContent);
    this.parser.eof();

    return this.syntaxBuilder.getFsm();
  }

  private getSourceCode(): string {
    return fs.readFileSync(this.file, "utf-8");
  }

  private reportSyntaxErrors(fsm: FsmSyntax): number {
    const syntaxErrorCount = fsm.errors.length;
    console.log(`Compiled with ${syntaxErrorCount} syntax error${syntaxErrorCount === 1 ? "" : "s"}.`);

    for (const error of fsm.errors) {
      console.log(error.toString());
    }

    return syntaxErrorCount;
  }

  private optimize(fsm: FsmSyntax): OptimizedStateMachine {
    const ast = new SemanticAnalyzer().analyze(fsm);
    return new Optimizer().optimize(ast);
  }

  private generateCode(optimizedStateMachine: OptimizedStateMachine): void {
    const generator = this.createGenerator(optimizedStateMachine);
    generator.generate();
  }

  private createGenerator(optimizedStateMachine: OptimizedStateMachine): CodeGenerator {
    {
      const generatorClass = codeGenerators[this.language.toLowerCase()];

      if (!generatorClass) {
        console.log(`The code generator class for ${this.language} language was not found.`);
        process.exit(0);
      }

      return new generatorClass(optimizedStateMachine, this.outputDirectory, this.flags);
    }
  }
}
