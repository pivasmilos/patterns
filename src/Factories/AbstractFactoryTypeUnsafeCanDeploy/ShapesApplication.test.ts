import { setup, teardown } from "../../TestUtils/testUtils";
import { PolarShapeFactory, ShapesApplication, CartesianShapeFactory } from "./ShapesApplication";

describe("ShapesApplication", () => {
  beforeEach(setup);
  afterEach(teardown);

  describe("run", () => {
    it("should draw shapes using PolarShapeFactory", () => {
      const shapeFactory = new PolarShapeFactory();
      const shapesApplication = new ShapesApplication(shapeFactory);

      shapesApplication.run();

      expect(console.log).toHaveBeenCalledWith("PolarCircle.draw: I'm a PolarCircle!");
      expect(console.log).toHaveBeenCalledWith("PolarSquare.draw: I'm a PolarSquare!");
    });

    it("should draw shapes using CartesianShapeFactory", () => {
      const shapeFactory = new CartesianShapeFactory();
      const shapesApplication = new ShapesApplication(shapeFactory);

      shapesApplication.run();

      expect(console.log).toHaveBeenCalledWith("Circle.draw: I'm a Circle!");
      expect(console.log).toHaveBeenCalledWith("Square.draw: I'm a Square!");
    });
  });
});
