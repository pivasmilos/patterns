import { Circle } from "../Shapes/Cartesian/Circle";
import { Square } from "../Shapes/Cartesian/Square";
import { Shape } from "../Shapes/Shape";
import { ShapesApplication } from "./ShapesApplication";

export class CartesianShapesApplication extends ShapesApplication {
  getShapeNames(): string[] {
    return ["circle", "square"];
  }

  makeShape(shapeName: string): Shape {
    switch (shapeName.toLowerCase()) {
      case "circle":
        return new Circle();
      case "square":
        return new Square();
      default:
        throw new Error(
          "CartesianShapesApplication.makeShape: Invalid shapeName: " +
            shapeName
        );
    }
  }
}
