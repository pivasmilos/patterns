import { Switchable, SwitchableCommandAdapter } from "../ButtonCommandActorModel";

describe("SwitchableCommandAdapter.execute", () => {
  it("should turn on the switchable", () => {
    const switchable: Switchable = { turnOn: jest.fn(), turnOff: jest.fn() };
    const sut = new SwitchableCommandAdapter(switchable);

    sut.execute();

    expect(switchable.turnOn).toHaveBeenCalled();
  });
});
