import { ShapePrototype } from "./ShapePrototype";
import { ShapePrototypesLibrary } from "./ShapePrototypesLibrary";

export class ShapesApplication {
  public static run(): void {
    const shapes: ShapePrototype[] = [];

    shapes.push(ShapePrototypesLibrary.circlePrototype.clone());
    shapes.push(ShapePrototypesLibrary.squarePrototype.clone());

    // TODO extract into a CompositeShape class
    for (const shape of shapes) {
      shape.color = "red";
      shape.draw();
    }
  }
}
