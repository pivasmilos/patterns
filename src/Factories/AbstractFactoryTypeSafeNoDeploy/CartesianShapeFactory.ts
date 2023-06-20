import { Circle } from "../Shapes/Cartesian/Circle";
import { Shape } from "../Shapes/Shape";
import { ShapeFactory } from "./ShapeFactory";
import { Square } from "../Shapes/Cartesian/Square";

export class CartesianShapeFactory implements ShapeFactory {
  makeCircle(): Shape {
    return new Circle();
  }
  makeSquare(): Shape {
    return new Square();
  }
}
