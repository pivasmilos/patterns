import { ShapePrototype } from "./ShapePrototype";

export class SquarePrototype extends ShapePrototype {
  override color = "black";

  override draw(): void {
    console.log(
      `SquarePrototype'.draw: I'm a SquarePrototype'! Color: ${this.color}`
    );
  }
}
