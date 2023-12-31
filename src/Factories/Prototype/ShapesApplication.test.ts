import { setup, teardown } from "../../testUtils";
import { ShapesApplication } from "./ShapesApplication";

describe("ShapesApplication", () => {
  beforeEach(setup);
  afterEach(teardown);

  describe("run", () => {
    it("should draw a red circle and a red square", () => {
      const sut = new ShapesApplication();

      sut.run();

      expect(console.log).toHaveBeenCalledWith("CirclePrototype'.draw: I'm a CirclePrototype'! Color: red");
      expect(console.log).toHaveBeenCalledWith("SquarePrototype'.draw: I'm a SquarePrototype'! Color: red");
    });
  });
});
