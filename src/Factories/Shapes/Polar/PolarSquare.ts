import { Shape } from "../Shape";

export class PolarSquare implements Shape {
  draw(): void {
    console.log("PolarSquare.draw: I'm a PolarSquare!");
  }
}
