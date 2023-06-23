import { setup, teardown } from "../TestUtils/testUtils";
import { Singleton } from "./Singleton";

describe("Singleton", () => {
  beforeEach(setup);
  afterEach(teardown);

  describe("getInstance", () => {
    it("should return the same instance", () => {
      const instance1 = Singleton.getInstance();
      const instance2 = Singleton.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe("doSomething", () => {
    it("should log a message to the console", () => {
      const instance = Singleton.getInstance();
      instance.doSomething();
      expect(console.log).toHaveBeenCalledWith("Doing something...");
    });
  });
});
