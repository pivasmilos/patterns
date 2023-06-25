export interface Paycheck {
  employeeId: string;
  date: Date;
  shouldGetPaid: boolean;
  amount: number;
  deliveryMethod: string;
}

export abstract class PaycheckStation {
  private nextStation?: PaycheckStation;

  public handlePaycheck(paycheck: Paycheck): void {
    const shouldContinue = this.doPaycheck(paycheck);

    if (shouldContinue && this.nextStation) {
      this.nextStation.handlePaycheck(paycheck);
    }
  }

  protected abstract doPaycheck(paycheck: Paycheck): boolean;

  public setNext(station: PaycheckStation | undefined): void {
    this.nextStation = station;
  }
}

export abstract class PaymentScheduler extends PaycheckStation {
  protected override doPaycheck(paycheck: Paycheck): boolean {
    paycheck.shouldGetPaid = this.shouldGetPaid(paycheck);
    return paycheck.shouldGetPaid;
  }

  protected abstract shouldGetPaid(paycheck: Paycheck): boolean;
}

export abstract class PaymentCalculator extends PaycheckStation {}

export abstract class PaymentDisposer extends PaycheckStation {
  protected deliver(paycheck: Paycheck) {
    console.log(`Delivering paycheck:`);
    console.log(JSON.stringify(paycheck));
  }
}

export class MonthlyPaymentScheduler extends PaymentScheduler {
  protected override shouldGetPaid(_paychek: Paycheck): boolean {
    // for demo purposes
    return true;
  }
}

export class BiWeeklyPaymentScheduler extends PaymentScheduler {
  protected override shouldGetPaid(_paychek: Paycheck): boolean {
    // for demo purposes
    return true;
  }
}

export class SalaryCalculator extends PaymentCalculator {
  protected override doPaycheck(paycheck: Paycheck): boolean {
    paycheck.amount = this.getEmployeeSalaryFromDatabase(paycheck.employeeId);
    return true;
  }

  private getEmployeeSalaryFromDatabase(_employeeId: string): number {
    return 1000;
  }
}

export class HourlyCalculator extends PaymentCalculator {
  protected override doPaycheck(paycheck: Paycheck): boolean {
    paycheck.amount =
      this.getEmployeeHoursFromDatabase(paycheck.employeeId) *
      this.getEmployeeHourlyRateFromDatabase(paycheck.employeeId);
    return true;
  }

  private getEmployeeHoursFromDatabase(_employeeId: string): number {
    return 80;
  }

  private getEmployeeHourlyRateFromDatabase(_employeeId: string): number {
    return 10;
  }
}

export class DirectDepositDisposer extends PaymentDisposer {
  protected doPaycheck(paycheck: Paycheck): boolean {
    paycheck.deliveryMethod = this.getEmployeeBankAccountFromDatabase(paycheck.employeeId);
    this.deliver(paycheck);
    return true;
  }

  private getEmployeeBankAccountFromDatabase(_employeeId: string): string {
    return "accountNumber: 123456789";
  }
}

export class MailDisposer extends PaymentDisposer {
  protected doPaycheck(paycheck: Paycheck): boolean {
    paycheck.deliveryMethod = this.getEmployeeAddressFromDatabase(paycheck.employeeId);
    this.deliver(paycheck);
    return true;
  }

  private getEmployeeAddressFromDatabase(_employeeId: string): string {
    return "address: 123 Main St.";
  }
}

export class Employee {
  constructor(
    public id: string,
    private scheduler: PaymentScheduler,
    private calculator: PaymentCalculator,
    private disposer: PaymentDisposer
  ) {}

  public getSchedulerAndBridgeTo(next: PaycheckStation) {
    this.scheduler.setNext(next);
    return this.scheduler;
  }

  public getCalculatorAndBridgeTo(next: PaycheckStation) {
    this.calculator.setNext(next);
    return this.calculator;
  }

  public getDisposer(): PaycheckStation {
    this.disposer.setNext(undefined);
    return this.disposer;
  }
}

export class Payroll {
  constructor(private employees: Employee[]) {}

  payday(): void {
    for (const employee of this.employees) {
      const paycheck = this.getEmptyPaycheckForEmployee(employee);
      const startingPaycheckStation = this.buildTheBridge(employee);
      startingPaycheckStation.handlePaycheck(paycheck);
    }
  }

  private buildTheBridge(employee: Employee) {
    return (
      //
      employee.getSchedulerAndBridgeTo(
        //
        employee.getCalculatorAndBridgeTo(
          //
          employee.getDisposer()
        )
      )
    );
  }

  private getEmptyPaycheckForEmployee(e: Employee) {
    return { employeeId: e.id, date: new Date(), amount: 0, shouldGetPaid: false, deliveryMethod: "" };
  }
}
