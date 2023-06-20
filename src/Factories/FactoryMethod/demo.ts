import { CartesianShapesApplication } from "./CartesianShapesApplication";
import { PolarShapesApplication } from "./PolarShapesApplication";

const app = new CartesianShapesApplication();

app.run();

// now we are stuck with the cartesian shapes :/

// we have to make a new app to use polar shapes

const polarApp = new PolarShapesApplication();

polarApp.run();
