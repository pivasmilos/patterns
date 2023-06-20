import { Shape } from "../Shapes/Shape";
import { ShapeFactory } from "./ShapeFactory";
import { PolarCircle } from "../Shapes/Polar/PolarCircle";
import { PolarSquare } from "../Shapes/Polar/PolarSquare";

export class PolarShapeFactory implements ShapeFactory {
  makeCircle(): Shape {
    return new PolarCircle();
  }
  makeSquare(): Shape {
    return new PolarSquare();
  }
}
