import { Switchable } from "./Switchable";

export class Light implements Switchable {
  constructor(private label: string = "") {}

  turnOn(): void {
    console.log(`SimpleLight: Light is on! Label: ${this.label}`);
  }

  turnOff(): void {
    console.log(`SimpleLight: Light is off! Label: ${this.label}`);
  }
}
