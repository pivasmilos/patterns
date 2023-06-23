import { setup, teardown } from "../TestUtils/testUtils";
import {
  PaycheckPrinterProxy,
  NetworkAPI,
  PaycheckPrinterListener,
  RealPaycheckPrinter,
  HardwarePrinter,
  NotificationAPI,
  PaycheckPrinter,
} from "./PaycheckPrinterProxy";

describe("Proxy pattern", () => {
  beforeEach(setup);
  afterEach(teardown);

  describe("PaycheckPrinterProxy", () => {
    it("should send a notification when printing a paycheck message", () => {
      const mockNotificationAPI: NotificationAPI = {
        sendNotification: jest.fn(),
        addListener: jest.fn(),
      };
      const paycheckPrinterProxy = new PaycheckPrinterProxy(mockNotificationAPI);
      paycheckPrinterProxy.printPaycheckMessage('{"id": 1, "amount": 1000}');
      expect(mockNotificationAPI.sendNotification).toHaveBeenCalledWith(
        'Printing paycheck message: {"id": 1, "amount": 1000}'
      );
    });
  });

  describe("NetworkAPI", () => {
    it("should notify listeners when sending a notification", () => {
      const networkAPI = new NetworkAPI();
      const mockListener: jest.Mock = jest.fn();
      networkAPI.addListener(mockListener);
      networkAPI.sendNotification("Test notification");
      expect(mockListener).toHaveBeenCalledWith("Test notification");
    });
  });

  describe("PaycheckPrinterListener", () => {
    it("should print a paycheck when receiving a notification", () => {
      const mockNotificationAPI: NotificationAPI = {
        sendNotification: jest.fn(),
        addListener: jest.fn(),
      };
      const mockPaycheckPrinter: PaycheckPrinter = {
        printPaycheckMessage: jest.fn(),
      };
      const paycheckPrinterListener: PaycheckPrinterListener = new PaycheckPrinterListener(
        mockNotificationAPI,
        mockPaycheckPrinter
      );
      paycheckPrinterListener.printPaycheckMessage('{"id": 1, "amount": 1000}');
      mockNotificationAPI.sendNotification('Paycheck printed: {"id": 1, "amount": 1000}');
      expect(mockPaycheckPrinter.printPaycheckMessage).toHaveBeenCalledWith('{"id": 1, "amount": 1000}');
    });
  });

  describe("RealPaycheckPrinter", () => {
    it("should print a paycheck message via hardware printer", () => {
      const mockHardwarePrinter: HardwarePrinter = {
        id: "42",
        configure: jest.fn(),
        print: jest.fn(),
      };
      const realPaycheckPrinter = new RealPaycheckPrinter(mockHardwarePrinter);
      realPaycheckPrinter.printPaycheckMessage('{"id": 1, "amount": 1000}');
      expect(mockHardwarePrinter.configure).toHaveBeenCalled();
      expect(mockHardwarePrinter.print).toHaveBeenCalledWith('{"id": 1, "amount": 1000}');
      expect(console.log).toHaveBeenCalledWith(
        'Paycheck message: {"id": 1, "amount": 1000} printed via hardware printer: 42'
      );
    });
  });
});
