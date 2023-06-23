import { setup, teardown } from "../../TestUtils/testUtils";
import { SimpleCommand } from "./SimpleCommand";

describe("SimpleCommand.execute", () => {
  beforeEach(setup);
  afterEach(teardown);

  it("should output the string to console", () => {
    const sut = new SimpleCommand("payload");

    sut.execute();

    expect(console.log).toHaveBeenCalledWith("SimpleCommand: See, I can do simple things like printing (payload)");
  });
});
