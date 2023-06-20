import { Shape } from "../Shape";

export class PolarCircle implements Shape {
  draw(): void {
    console.log("PolarCircle.draw: I'm a PolarCircle!");
  }
}
