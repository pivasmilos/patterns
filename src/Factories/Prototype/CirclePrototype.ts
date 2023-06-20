import { ShapePrototype } from "./ShapePrototype";

export class CirclePrototype extends ShapePrototype {
  override color = "white";

  override draw(): void {
    console.log(
      `CirclePrototype'.draw: I'm a CirclePrototype'! Color: ${this.color}`
    );
  }
}
