import { setup, teardown } from "../TestUtils/testUtils";
import {
  Payroll,
  Employee,
  MonthlyPaymentScheduler,
  SalaryCalculator,
  DirectDepositDisposer,
  BiWeeklyPaymentScheduler,
  HourlyCalculator,
  MailDisposer,
} from "./PayrollBridge";

const OriginalDate = Date;

function mockDate(date: Date) {
  // OK for test purposes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.Date = jest.fn(() => date) as any;
}

function restoreMockDate() {
  global.Date = OriginalDate;
}

describe("Payroll", () => {
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
      new MonthlyPaymentScheduler(),
      new SalaryCalculator(),
      new DirectDepositDisposer()
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
      new BiWeeklyPaymentScheduler(),
      new HourlyCalculator(),
      new DirectDepositDisposer()
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
    const employee = new Employee("3", new MonthlyPaymentScheduler(), new SalaryCalculator(), new MailDisposer());
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
