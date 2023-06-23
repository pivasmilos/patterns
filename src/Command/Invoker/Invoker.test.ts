import { setup, teardown } from "../../TestUtils/testUtils";
import { Invoker, UnregisteredCommandsError } from "./Invoker";

describe("Invoker", () => {
  beforeEach(setup);
  afterEach(teardown);

  describe("doSomethingImportant", () => {
    it("throws UnregisteredCommandsError when the commands are not registered", () => {
      const sut = new Invoker();

      expect(() => sut.execute()).toThrow(UnregisteredCommandsError);
    });

    it("it executes the onStart command when it is registered", () => {
      const sut = new Invoker();
      const onStart = { execute: jest.fn() };
      const onFinish = { execute: jest.fn() };
      sut.registerCommands({ onStart, onFinish });

      sut.execute();

      expect(onStart.execute).toHaveBeenCalled();
    });

    it("it executes the onFinish command when it is registered", () => {
      const sut = new Invoker();
      const onStart = { execute: jest.fn() };
      const onFinish = { execute: jest.fn() };
      sut.registerCommands({ onStart, onFinish });

      sut.execute();

      expect(onFinish.execute).toHaveBeenCalled();
    });
  });
});
