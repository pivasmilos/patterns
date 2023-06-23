import { JavaCodeGenerator } from "./JavaCodeGenerator";

// extend with a union of others when they are implemented
export type CodeGenerators = typeof JavaCodeGenerator;

export const codeGenerators: Record<string, CodeGenerators> = {
  java: JavaCodeGenerator,
};
