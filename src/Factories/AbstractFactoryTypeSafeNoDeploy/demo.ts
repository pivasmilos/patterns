import { CartesianShapeFactory } from "./CartesianShapeFactory";
import { PolarShapeFactory } from "./PolarShapeFactory";
import { ShapesApplication } from "./ShapesApplication";

const app = new ShapesApplication(new CartesianShapeFactory());

app.run();

app.shapeFactory = new PolarShapeFactory();

app.run();
