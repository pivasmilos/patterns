import { Circle } from "../Shapes/Cartesian/Circle";
import { Square } from "../Shapes/Cartesian/Square";
import { PolarCircle } from "../Shapes/Polar/PolarCircle";
import { PolarSquare } from "../Shapes/Polar/PolarSquare";
import { Shape } from "../Shapes/Shape";

export abstract class ShapesApplication {
  run() {
    const shapes: Shape[] = [];

    shapes.push(this.makeShape("circle"));
    shapes.push(this.makeShape("square"));

    // TODO extract into a CompositeShape class
    for (const shape of shapes) {
      shape.draw();
    }
  }

  protected abstract getShapeNames(): string[];

  /**
   * This is the factory method.
   *
   * Btw, we are solving the independent deployability problem here by abandoning type safety.
   * Instead, we have generic string describing which shape to make.
   */
  protected abstract makeShape(shapeName: string): Shape;
}

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
        throw new Error("CartesianShapesApplication.makeShape: Invalid shapeName: " + shapeName);
    }
  }
}

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
        throw new Error("CartesianShapesApplication.makeShape: Invalid shapeName: " + shapeName);
    }
  }
}
