export interface TokenCollector {
  openBrace(line: number, pos: number): void;
  closedBrace(line: number, pos: number): void;
  openParen(line: number, pos: number): void;
  closedParen(line: number, pos: number): void;
  openAngle(line: number, pos: number): void;
  closedAngle(line: number, pos: number): void;
  dash(line: number, pos: number): void;
  colon(line: number, pos: number): void;
  name(name: string, line: number, pos: number): void;
  error(line: number, pos: number): void;
}
