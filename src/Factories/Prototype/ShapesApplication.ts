import { ShapePrototype } from "./ShapePrototype";
import { circlePrototype, squarePrototype } from "./ShapePrototypesLibrary";

export class ShapesApplication {
  public run(): void {
    const shapes: ShapePrototype[] = [];

    shapes.push(circlePrototype.clone());
    shapes.push(squarePrototype.clone());

    // TODO extract into a CompositeShape class
    for (const shape of shapes) {
      shape.color = "red";
      shape.draw();
    }
  }
}
