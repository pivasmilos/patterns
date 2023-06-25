import { setup, teardown } from "../../../TestUtils/testUtils";
import { CommandsActor, Switchable, ButtonCommandWithActor } from "../ButtonCommandActorModel";

describe("ButtonCommandWithActor", () => {
  beforeEach(setup);
  afterEach(teardown);

  it("should turn on the switchable when the button is pressed", () => {
    const actor = new CommandsActor();
    const buttonListener = { isPressed: jest.fn().mockReturnValue(true) };
    const switchable: Switchable = { turnOn: jest.fn(), turnOff: jest.fn() };
    const buttonCode = "42";
    const sut = new ButtonCommandWithActor(actor, buttonListener, buttonCode, switchable);
    actor.addCommand(sut);

    actor.run();

    expect(switchable.turnOn).toHaveBeenCalled();
  });

  it("should turn on multiple switchables when their buttons are pressed", () => {
    const actor = new CommandsActor();
    const buttonListener = { isPressed: jest.fn().mockReturnValue(true) };
    const switchable1: Switchable = { turnOn: jest.fn(), turnOff: jest.fn() };
    const switchable2: Switchable = { turnOn: jest.fn(), turnOff: jest.fn() };
    const buttonCode1 = "42";
    const buttonCode2 = "43";
    const sut1 = new ButtonCommandWithActor(actor, buttonListener, buttonCode1, switchable1);
    const sut2 = new ButtonCommandWithActor(actor, buttonListener, buttonCode2, switchable2);
    actor.addCommand(sut1);
    actor.addCommand(sut2);

    actor.run();

    expect(switchable1.turnOn).toHaveBeenCalled();
    expect(switchable2.turnOn).toHaveBeenCalled();
  });
});
