import { TokenCollector } from "./TokenCollector";

export class Lexer {
  private collector: TokenCollector;
  private lineNumber = 0;
  private position = 0;

  constructor(collector: TokenCollector) {
    this.collector = collector;
  }

  public lex(s: string): void {
    this.lineNumber = 1;
    const lines: string[] = s.split("\n");
    for (const line of lines) {
      this.lexLine(line);
      this.lineNumber++;
    }
  }

  private lexLine(line: string): void {
    for (this.position = 0; this.position < line.length; ) {
      this.lexToken(line);
    }
  }

  private lexToken(line: string): void {
    if (!this.findToken(line)) {
      this.collector.error(this.lineNumber, this.position + 1);
      this.position += 1;
    }
  }

  private findToken(line: string): boolean {
    return this.findWhiteSpace(line) || this.findSingleCharacterToken(line) || this.findName(line);
  }

  private static whitePattern = /^\s+/;
  private static commentPattern = /^\/\/.*$/;
  private static whitePatterns: RegExp[] = [Lexer.whitePattern, Lexer.commentPattern];

  private findWhiteSpace(line: string): boolean {
    for (const pattern of Lexer.whitePatterns) {
      const matcher = line.substring(this.position).match(pattern);
      if (matcher) {
        this.position += matcher[0].length;
        return true;
      }
    }

    return false;
  }

  private findSingleCharacterToken(line: string): boolean {
    const c: string = line.substring(this.position, this.position + 1);
    switch (c) {
      case "{":
        this.collector.openBrace(this.lineNumber, this.position);
        break;
      case "}":
        this.collector.closedBrace(this.lineNumber, this.position);
        break;
      case "(":
        this.collector.openParen(this.lineNumber, this.position);
        break;
      case ")":
        this.collector.closedParen(this.lineNumber, this.position);
        break;
      case "<":
        this.collector.openAngle(this.lineNumber, this.position);
        break;
      case ">":
        this.collector.closedAngle(this.lineNumber, this.position);
        break;
      case "-":
        this.collector.dash(this.lineNumber, this.position);
        break;
      case "*":
        this.collector.dash(this.lineNumber, this.position);
        break;
      case ":":
        this.collector.colon(this.lineNumber, this.position);
        break;
      default:
        return false;
    }
    this.position++;
    return true;
  }

  private static namePattern = /^\w+/;

  private findName(line: string): boolean {
    const nameMatcher = line.substring(this.position).match(Lexer.namePattern);
    if (!nameMatcher) {
      return false;
    }

    this.collector.name(nameMatcher[0], this.lineNumber, this.position);
    this.position += nameMatcher[0].length;
    return true;
  }
}
