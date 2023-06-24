import { setup, teardown } from "../../TestUtils/testUtils";
import { PolarShapesApplication, CartesianShapesApplication } from "./ShapesApplication";

describe("ShapesApplication", () => {
  beforeEach(setup);
  afterEach(teardown);

  describe("PolarShapesApplication.run", () => {
    it("should draw shapes using PolarShapeFactory", () => {
      const shapesApplication = new PolarShapesApplication();

      shapesApplication.run();

      expect(console.log).toHaveBeenCalledWith("PolarCircle.draw: I'm a PolarCircle!");
      expect(console.log).toHaveBeenCalledWith("PolarSquare.draw: I'm a PolarSquare!");
    });
  });
  describe("CartesianShapesApplication.run", () => {
    it("should draw shapes using CartesianShapeFactory", () => {
      const shapesApplication = new CartesianShapesApplication();

      shapesApplication.run();

      expect(console.log).toHaveBeenCalledWith("Circle.draw: I'm a Circle!");
      expect(console.log).toHaveBeenCalledWith("Square.draw: I'm a Square!");
    });
  });
});
