import { setup, teardown } from "../TestUtils/testUtils";
import { ThirdPartyLight, ObjectLightAdapter, Button, LightAdapterClass } from "./LightAdapters";

describe("Adapter pattern", () => {
  beforeEach(setup);
  afterEach(teardown);

  describe("Object version", () => {
    // need to create the Light object, but can also change it at runtime
    // i.e. it's more flexible but harder to use

    test("should turn on and off third party light using adapter", () => {
      const thirdPartyLight = new ThirdPartyLight();
      const lightAdapter = new ObjectLightAdapter(thirdPartyLight);
      const button = new Button(lightAdapter);

      button.turnOn();
      expect(console.log).toHaveBeenCalledWith("Third party white light is on");

      button.turnOff();
      expect(console.log).toHaveBeenCalledWith("Third party white light is off");
    });

    test("can reassign the button to a different light at runtime", () => {
      const thirdPartyLight = new ThirdPartyLight();
      const lightAdapter = new ObjectLightAdapter(thirdPartyLight);
      const button = new Button(lightAdapter);

      button.turnOn();

      expect(console.log).toHaveBeenCalledWith("Third party white light is on");

      button.setSwitchable(new ObjectLightAdapter(new ThirdPartyLight("red")));
      button.turnOn();

      expect(console.log).toHaveBeenCalledWith("Third party red light is on");
    });
  });

  describe("Class version", () => {
    // don't have to create the Light object, but also can't change it at runtime
    // i.e. it's more rigid but easier to use

    test("should turn on and off third party light using adapter", () => {
      const lightAdapter = new LightAdapterClass();
      const button = new Button(lightAdapter);

      button.turnOn();
      expect(console.log).toHaveBeenCalledWith("Third party white light is on");

      button.turnOff();
      expect(console.log).toHaveBeenCalledWith("Third party white light is off");
    });
  });
});
