import { Shape } from "../Shapes/Shape";

/**
 * Provides an interface for creating families of related or dependent objects without specifying their concrete classes.
 */
export interface ShapeFactory {
  makeCircle(): Shape;
  makeSquare(): Shape;
}
