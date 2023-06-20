import { Circle } from "../Shapes/Cartesian/Circle";
import { Square } from "../Shapes/Cartesian/Square";
import { Shape } from "../Shapes/Shape";
import { ShapeFactory } from "./ShapeFactory";

export class CartesianShapeFactory implements ShapeFactory {
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
          "CartesianShapeFactory.makeShape: Invalid shapeName: " + shapeName
        );
    }
  }
}
