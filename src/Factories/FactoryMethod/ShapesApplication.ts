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
