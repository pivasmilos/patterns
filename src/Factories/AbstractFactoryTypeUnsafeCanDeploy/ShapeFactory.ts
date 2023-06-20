import { Shape } from "../Shapes/Shape";

export interface ShapeFactory {
  makeShape(shapeName: string): Shape;
  getShapeNames(): string[];
}
