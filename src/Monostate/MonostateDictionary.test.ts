import { MonostateDictionary } from "./MonostateDictionary";

describe("MonostateDictionary", () => {
  describe("_state", () => {
    it("should be shared between instances", () => {
      const instance1 = new MonostateDictionary();
      const instance2 = new MonostateDictionary();

      instance1.set("message", "Hello from instance 1");
      expect(instance1.get("message")).toEqual("Hello from instance 1");
      expect(instance2.get("message")).toEqual("Hello from instance 1");

      instance2.set("message", "Hello from instance 2");
      expect(instance1.get("message")).toEqual("Hello from instance 2");
      expect(instance2.get("message")).toEqual("Hello from instance 2");
    });

    it("should persist data after deleting an instance even across scopes", () => {
      {
        // scope 1
        let instance1: MonostateDictionary | null = null;
        instance1 = new MonostateDictionary();
        instance1.set("message", "Hello from instance 1");
        instance1 = null; // closest thing to deleting an instance in JS
      }

      {
        // scope 2 - instance 2 doesn't know about instance 1 and still has access to the state
        const instance2 = new MonostateDictionary();
        expect(instance2.get("message")).toEqual("Hello from instance 1");
      }
    });
  });
});
