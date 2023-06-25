import { setup, teardown } from "../testUtils";
import { Payroll, Employee, PaymentSchedulerType, PaymentCalculatorType, PaymentDisposerType } from "./PayrollChain";

const OriginalDate = Date;

function mockDate(date: Date) {
  // OK for test purposes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.Date = jest.fn(() => date) as any;
}

function restoreMockDate() {
  global.Date = OriginalDate;
}

describe("Payroll Chain of Responsibility", () => {
  const date = new Date("2022-01-31T00:00:00.000Z");

  beforeEach(() => {
    setup();
    mockDate(date);
  });

  afterEach(() => {
    teardown();
    restoreMockDate();
  });

  it("should pay monthly employees with direct deposit", () => {
    const employee = new Employee(
      "1",
      PaymentSchedulerType.MONTHLY,
      PaymentCalculatorType.SALARY,
      PaymentDisposerType.DIRECT
    );
    const payroll = new Payroll([employee]);

    payroll.payday();

    expect(console.log).toHaveBeenCalledWith("Delivering paycheck:");
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"employeeId":"1"'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"date":"2022-01-31T00:00:00.000Z"'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"amount":1000'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"shouldGetPaid":true'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"deliveryMethod":"accountNumber: 123456789"'));
    expect(console.log).toHaveBeenCalledTimes(2);
  });

  it("should pay bi-weekly employees with direct deposit", () => {
    const employee = new Employee(
      "2",
      PaymentSchedulerType.BI_WEEKLY,
      PaymentCalculatorType.HOURLY,
      PaymentDisposerType.DIRECT
    );
    const payroll = new Payroll([employee]);

    payroll.payday();

    expect(console.log).toHaveBeenCalledWith("Delivering paycheck:");
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"employeeId":"2"'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"date":"2022-01-31T00:00:00.000Z"'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"amount":800'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"shouldGetPaid":true'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"deliveryMethod":"accountNumber: 123456789"'));
    expect(console.log).toHaveBeenCalledTimes(2);
  });

  it("should pay monthly employees by mail", () => {
    const employee = new Employee(
      "3",
      PaymentSchedulerType.MONTHLY,
      PaymentCalculatorType.SALARY,
      PaymentDisposerType.MAIL
    );
    const payroll = new Payroll([employee]);

    payroll.payday();

    expect(console.log).toHaveBeenCalledWith("Delivering paycheck:");
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"employeeId":"3"'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"date":"2022-01-31T00:00:00.000Z"'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"amount":1000'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"shouldGetPaid":true'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"deliveryMethod":"address: 123 Main St."'));
    expect(console.log).toHaveBeenCalledTimes(2);
  });
});
