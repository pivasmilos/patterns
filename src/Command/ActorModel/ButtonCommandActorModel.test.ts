import { setup, teardown } from "../../testUtils";
import { CommandsActor, Light, ButtonsListener, ButtonCommandWithActor } from "./ButtonCommandActorModel";

describe("Actor Model with Command pattern", () => {
  beforeEach(setup);
  afterEach(teardown);

  test("should turn on light when button is pressed", () => {
    const buttonListener: ButtonsListener = {
      isPressed: jest.fn().mockReturnValue(true),
    };
    const commandsActor = new CommandsActor();
    const buttonCommandA = new ButtonCommandWithActor(commandsActor, buttonListener, "A", new Light("LA"));

    commandsActor.addCommand(buttonCommandA);
    commandsActor.run();

    expect(console.log).toHaveBeenCalledWith("SimpleLight: Light is on! Label: LA");
    expect(buttonListener.isPressed).toHaveBeenCalledWith("A");
  });

  test("should turn on multiple lights when their buttons are pressed", () => {
    const buttonListener: ButtonsListener = {
      isPressed: jest.fn().mockReturnValue(true),
    };
    const commandsActor = new CommandsActor();
    const buttonCommandA = new ButtonCommandWithActor(commandsActor, buttonListener, "A", new Light("LA"));
    const buttonCommandB = new ButtonCommandWithActor(commandsActor, buttonListener, "B", new Light("LB"));

    commandsActor.addCommand(buttonCommandA);
    commandsActor.addCommand(buttonCommandB);
    commandsActor.run();

    expect(console.log).toHaveBeenCalledWith("SimpleLight: Light is on! Label: LA");
    expect(console.log).toHaveBeenCalledWith("SimpleLight: Light is on! Label: LB");
    expect(buttonListener.isPressed).toHaveBeenCalledWith("A");
    expect(buttonListener.isPressed).toHaveBeenCalledWith("B");
  });
});
