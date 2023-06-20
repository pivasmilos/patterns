import { Shape } from "../Shapes/Shape";
import { ShapeFactory } from "./ShapeFactory";

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
