import { setup, teardown } from "../../../TestUtils/testUtils";
import { CommandsActor } from "../ButtonCommandActorModel";

describe("Actor", () => {
  beforeEach(setup);
  afterEach(teardown);

  describe("run added commands", () => {
    it("runs the single added command", () => {
      const sut = new CommandsActor();
      const command = { execute: jest.fn() };
      sut.addCommand(command);

      sut.run();

      expect(command.execute).toHaveBeenCalled();
    });

    it("runs the multiple added commands", () => {
      const sut = new CommandsActor();
      const command1 = { execute: jest.fn() };
      const command2 = { execute: jest.fn() };
      const command3 = { execute: jest.fn() };
      sut.addCommand(command1);
      sut.addCommand(command2);
      sut.addCommand(command3);

      sut.run();

      expect(command1.execute).toHaveBeenCalled();
      expect(command2.execute).toHaveBeenCalled();
      expect(command3.execute).toHaveBeenCalled();
    });
  });
});
