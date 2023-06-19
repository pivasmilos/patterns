import { hello } from "./hello";

describe("hello", () => {
  it('should return "Hello world!" when given no arguments', () => {
    expect(hello()).toBe("Hello world!");
  });

  it('should return "Hello John!" when given "John"', () => {
    expect(hello("John")).toBe("Hello John!");
  });
});
