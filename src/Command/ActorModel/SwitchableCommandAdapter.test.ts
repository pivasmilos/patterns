import { Switchable } from "./Switchable";
import { SwitchableCommandAdapter } from "./SwitchableCommandAdapter";

describe("SwitchableCommandAdapter.execute", () => {
  it("should turn on the switchable", () => {
    const switchable: Switchable = { turnOn: jest.fn(), turnOff: jest.fn() };
    const sut = new SwitchableCommandAdapter(switchable);

    sut.execute();

    expect(switchable.turnOn).toHaveBeenCalled();
  });
});
