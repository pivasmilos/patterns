import { Shape } from "../Shapes/Shape";

export interface Cloneable {
  clone(): Cloneable;
}
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

export class CirclePrototype extends ShapePrototype {
  override color = "white";

  override draw(): void {
    console.log(`CirclePrototype'.draw: I'm a CirclePrototype'! Color: ${this.color}`);
  }
}

export class SquarePrototype extends ShapePrototype {
  override color = "black";

  override draw(): void {
    console.log(`SquarePrototype'.draw: I'm a SquarePrototype'! Color: ${this.color}`);
  }
}

// might live in e.g. PrototypeLibrary.ts
export const circlePrototype: ShapePrototype = new CirclePrototype();
export const squarePrototype: ShapePrototype = new SquarePrototype();

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
