import { Shape } from "../Shapes/Shape";
import { Cloneable } from "./Cloneable";

export interface ColoredShape extends Shape {
  color: string;
}

export abstract class ShapePrototype implements ColoredShape, Cloneable {
  public clone(): ShapePrototype {
    return Object.create(this);
  }

  public abstract color: string;
  public abstract draw(): void;
}
