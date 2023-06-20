import { CirclePrototype } from "./CirclePrototype";
import { ShapePrototype } from "./ShapePrototype";
import { SquarePrototype } from "./SquarePrototype";

export class ShapePrototypesLibrary {
  public static circlePrototype: ShapePrototype = new CirclePrototype();
  public static squarePrototype: ShapePrototype = new SquarePrototype();
}
