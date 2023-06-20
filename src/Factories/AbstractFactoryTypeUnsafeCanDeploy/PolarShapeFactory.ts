import { PolarCircle } from "../Shapes/Polar/PolarCircle";
import { PolarSquare } from "../Shapes/Polar/PolarSquare";
import { Shape } from "../Shapes/Shape";
import { ShapeFactory } from "./ShapeFactory";

export class PolarShapeFactory implements ShapeFactory {
  getShapeNames(): string[] {
    return ["circle", "square"];
  }

  makeShape(shapeName: string): Shape {
    switch (shapeName.toLowerCase()) {
      case "circle":
        return new PolarCircle();
      case "square":
        return new PolarSquare();
      default:
        throw new Error(
          "PolarShapeFactory.makeShape: Invalid shapeName: " + shapeName
        );
    }
  }
}
