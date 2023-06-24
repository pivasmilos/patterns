import { Circle } from "../Shapes/Cartesian/Circle";
import { Square } from "../Shapes/Cartesian/Square";
import { PolarCircle } from "../Shapes/Polar/PolarCircle";
import { PolarSquare } from "../Shapes/Polar/PolarSquare";
import { Shape } from "../Shapes/Shape";

export interface ShapeFactory {
  makeShape(shapeName: string): Shape;
  getShapeNames(): string[];
}

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
        throw new Error("CartesianShapeFactory.makeShape: Invalid shapeName: " + shapeName);
    }
  }
}

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
        throw new Error("PolarShapeFactory.makeShape: Invalid shapeName: " + shapeName);
    }
  }
}

export class ShapesApplication {
  constructor(private _shapeFactory: ShapeFactory) {}

  public set shapeFactory(shapeFactory: ShapeFactory) {
    this._shapeFactory = shapeFactory;
  }

  public run(): void {
    const shapes: Shape[] = [];

    shapes.push(this._shapeFactory.makeShape("circle"));
    shapes.push(this._shapeFactory.makeShape("square"));

    // TODO extract into a CompositeShape class
    for (const shape of shapes) {
      shape.draw();
    }
  }
}
