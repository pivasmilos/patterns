import { setup, teardown } from "../../TestUtils/testUtils";
import { ComplexCommand } from "./ComplexCommand";
import { Receiver } from "./Receiver";

describe("ComplexCommand.execute", () => {
  beforeEach(setup);
  afterEach(teardown);

  it("should output the string to console", () => {
    const receiver = new Receiver();
    const sut = new ComplexCommand(receiver, {
      a: "a",
      b: "b",
    });

    sut.execute();

    expect(console.log).toHaveBeenCalledWith("ComplexCommand: Complex stuff should be done by a receiver object.");
  });
});
