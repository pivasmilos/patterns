export interface Switchable {
  turnOn(): void;
  turnOff(): void;
}

export class ThirdPartyLight {
  constructor(private color: string = "white") {}

  public turnOnLight() {
    console.log(`Third party ${this.color} light is on`);
  }

  public turnOffLight() {
    console.log(`Third party ${this.color} light is off`);
  }
}

export class Button implements Switchable {
  constructor(private switchable: Switchable) {}

  public setSwitchable(switchable: Switchable) {
    this.switchable = switchable;
  }

  public turnOn() {
    this.switchable.turnOn();
  }

  public turnOff() {
    this.switchable.turnOff();
  }
}

export class ObjectLightAdapter implements Switchable {
  private light: ThirdPartyLight;

  constructor(light: ThirdPartyLight) {
    this.light = light;
  }

  public turnOn() {
    this.light.turnOnLight();
  }

  public turnOff() {
    this.light.turnOffLight();
  }

  public setLight(light: ThirdPartyLight) {
    this.light = light;
  }
}

export class LightAdapterClass extends ThirdPartyLight implements Switchable {
  public turnOn() {
    this.turnOnLight();
  }

  public turnOff() {
    this.turnOffLight();
  }
}
