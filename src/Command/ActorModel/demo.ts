import { ButtonCommandWithActor } from "./ButtonCommandWithActor";
import { CommandsActor } from "./CommandsActor";
import { Light } from "./Light";
import { ButtonsListener } from "./ButtonsListener";

const actor = new CommandsActor();
const buttonListener: ButtonsListener = {
  isPressed: (buttonCode) => {
    // always pressed, for demo purposes
    console.log(`Button ${buttonCode} has been pressed.`);
    return true;
  },
};

const light1 = new Light("red");
const light2 = new Light("green");
const light3 = new Light("blue");

const buttonCmd1 = new ButtonCommandWithActor(
  actor,
  buttonListener,
  "a",
  light1
);
const buttonCmd2 = new ButtonCommandWithActor(
  actor,
  buttonListener,
  "s",
  light2
);
const buttonCmd3 = new ButtonCommandWithActor(
  actor,
  buttonListener,
  "d",
  light3
);

actor.addCommand(buttonCmd1);
actor.addCommand(buttonCmd2);
actor.addCommand(buttonCmd3);

actor.run();
