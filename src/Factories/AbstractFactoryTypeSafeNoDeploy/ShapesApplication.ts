import { Circle } from "../Shapes/Cartesian/Circle";
import { Square } from "../Shapes/Cartesian/Square";
import { PolarCircle } from "../Shapes/Polar/PolarCircle";
import { PolarSquare } from "../Shapes/Polar/PolarSquare";
import { Shape } from "../Shapes/Shape";

/**
 * Provides an interface for creating families of related or dependent objects
 * without specifying their concrete classes.
 *
 * Notice, though, that whenever we add a new shape,
 * we would have to **recompile and redeploy the ShapeFactory interface
 * and all of the factories that implement the interface,
 * even if we don't need the new shape in some or all of the factories**.
 */
export interface ShapeFactory {
  makeCircle(): Shape;
  makeSquare(): Shape;
}

export class PolarShapeFactory implements ShapeFactory {
  makeCircle(): Shape {
    return new PolarCircle();
  }
  makeSquare(): Shape {
    return new PolarSquare();
  }
}

export class CartesianShapeFactory implements ShapeFactory {
  makeCircle(): Shape {
    return new Circle();
  }
  makeSquare(): Shape {
    return new Square();
  }
}

export class ShapesApplication {
  constructor(private _shapeFactory: ShapeFactory) {}

  public set shapeFactory(shapeFactory: ShapeFactory) {
    this._shapeFactory = shapeFactory;
  }

  public run(): void {
    const shapes: Shape[] = [];

    shapes.push(this._shapeFactory.makeCircle());
    shapes.push(this._shapeFactory.makeSquare());

    // TODO extract into a CompositeShape class
    for (const shape of shapes) {
      shape.draw();
    }
  }
}
