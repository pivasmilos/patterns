import { PolarCircle } from "../Shapes/Polar/PolarCircle";
import { PolarSquare } from "../Shapes/Polar/PolarSquare";
import { Shape } from "../Shapes/Shape";
import { ShapesApplication } from "./ShapesApplication";

export class PolarShapesApplication extends ShapesApplication {
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
          "CartesianShapesApplication.makeShape: Invalid shapeName: " +
            shapeName
        );
    }
  }
}
