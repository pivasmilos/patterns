import { setup, teardown } from "../../testUtils";
import { Receiver } from "./Receiver";

describe("Receiver", () => {
  beforeEach(setup);
  afterEach(teardown);

  describe("doSomething", () => {
    it("should output the string to console", () => {
      const sut = new Receiver();

      sut.doSomething("a");

      expect(console.log).toHaveBeenCalledWith("Receiver: Working on (a).");
    });
  });

  describe("doSomethingElse", () => {
    it("should output the string to console", () => {
      const sut = new Receiver();

      sut.doSomethingElse("b");

      expect(console.log).toHaveBeenCalledWith("Receiver: Also working on (b).");
    });
  });
});
