import { setup, teardown } from "../testUtils";
import { ModemControlProgram, User, createModem } from "./ModemDecorator";

describe("Decorator pattern", () => {
  beforeEach(setup);
  afterEach(teardown);

  describe("ModemControlProgram", () => {
    it("should dial a number using a Hayes modem", () => {
      const modemControlProgram = new ModemControlProgram("Hayes");
      const user = new User("Alice", "high");

      user.dial("555-1234", modemControlProgram);

      expect(console.log).toHaveBeenCalledWith("Dialing 555-1234 loudly...");
      expect(console.log).toHaveBeenCalledWith("Dialing 555-1234 using Hayes modem...");
    });

    it("should dial a number using a USR modem", () => {
      const modemControlProgram = new ModemControlProgram("USR");
      const user = new User("Bob", "low");

      user.dial("555-5678", modemControlProgram);

      expect(console.log).toHaveBeenCalledWith("Dialing 555-5678 quietly...");
      expect(console.log).toHaveBeenCalledWith("Dialing 555-5678 using USR modem...");
    });
  });

  describe("ModemFactory", () => {
    it("should create a loud dial Hayes modem", () => {
      const modem = createModem("high", "Hayes");
      modem.dial("555-1234");

      expect(console.log).toHaveBeenCalledWith("Dialing 555-1234 loudly...");
      expect(console.log).toHaveBeenCalledWith("Dialing 555-1234 using Hayes modem...");
    });

    it("should create a quiet dial USR modem", () => {
      const modem = createModem("low", "USR");
      modem.dial("555-5678");

      expect(console.log).toHaveBeenCalledWith("Dialing 555-5678 quietly...");
      expect(console.log).toHaveBeenCalledWith("Dialing 555-5678 using USR modem...");
    });

    it("should default to a loud dial Hayes modem", () => {
      const modem = createModem("high");
      modem.dial("555-1234");

      expect(console.log).toHaveBeenCalledWith("Dialing 555-1234 loudly...");
      expect(console.log).toHaveBeenCalledWith("Dialing 555-1234 using Hayes modem...");
    });
  });

  describe("User", () => {
    it("should dial a number using a modem", () => {
      const modemControlProgram = new ModemControlProgram("Hayes");
      const user = new User("Dave", "high");

      user.dial("555-3456", modemControlProgram);

      expect(console.log).toHaveBeenCalledWith("Dialing 555-3456 loudly...");
      expect(console.log).toHaveBeenCalledWith("Dialing 555-3456 using Hayes modem...");
    });
  });
});
