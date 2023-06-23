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

  describe("how to test a class that uses a Singleton", () => {
    class ClassThatUsesSingleton {
      public getData(): string {
        const instance = Singleton.getInstance();
        return instance.data;
      }
    }

    it("should return the data from the Singleton", () => {
      const sut = new ClassThatUsesSingleton();
      // keeping testability at the cost of breaking Singleton's encapsulation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Singleton as any).data = "42";

      const result = sut.getData();
      expect(result).toBe("42");
    });
  });
});
