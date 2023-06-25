export enum PaymentSchedulerType {
  MONTHLY = "MONTHLY",
  BI_WEEKLY = "BI_WEEKLY",
}

export enum PaymentCalculatorType {
  SALARY = "SALARY",
  HOURLY = "HOURLY",
}

export enum PaymentDisposerType {
  DIRECT = "DIRECT",
  MAIL = "MAIL",
}

export class Employee {
  constructor(
    public id: string,
    public schedulerType: PaymentSchedulerType,
    public calculatorType: PaymentCalculatorType,
    public disposerType: PaymentDisposerType
  ) {}
}

export interface Paycheck {
  employee: Employee;
  date: Date;
  shouldGetPaid: boolean;
  amount: number;
  deliveryMethod: string;
}

export abstract class PaycheckStation {
  constructor(private nextStation?: PaycheckStation) {}

  public handlePaycheck(paycheck: Paycheck): void {
    const shouldContinue = this.doPaycheck(paycheck);

    if (shouldContinue && this.nextStation) {
      this.nextStation.handlePaycheck(paycheck);
    }
  }

  protected abstract doPaycheck(paycheck: Paycheck): boolean;
}

export abstract class PaymentScheduler extends PaycheckStation {}

export abstract class PaymentCalculator extends PaycheckStation {}

export abstract class PaymentDisposer extends PaycheckStation {
  protected deliver(paycheck: Paycheck) {
    console.log(`Delivering paycheck:`);
    console.log(
      JSON.stringify({
        ...paycheck,
        employee: undefined,
        employeeId: paycheck.employee.id, // hiding all employee info except the ID
      })
    );
  }
}

export class MonthlyPaymentScheduler extends PaymentScheduler {
  protected override doPaycheck(paycheck: Paycheck): boolean {
    if (paycheck.employee.schedulerType !== PaymentSchedulerType.MONTHLY) {
      return true; // just continue to the next station
    }

    paycheck.shouldGetPaid = this.shouldGetPaid(paycheck);
    return paycheck.shouldGetPaid;
  }

  private shouldGetPaid(_paychek: Paycheck): boolean {
    // for demo purposes
    return true;
  }
}

export class BiWeeklyPaymentScheduler extends PaymentScheduler {
  protected override doPaycheck(paycheck: Paycheck): boolean {
    if (paycheck.employee.schedulerType !== PaymentSchedulerType.BI_WEEKLY) {
      return true; // just continue to the next station
    }

    paycheck.shouldGetPaid = this.shouldGetPaid(paycheck);
    return paycheck.shouldGetPaid;
  }

  private shouldGetPaid(_paychek: Paycheck): boolean {
    // for demo purposes
    return true;
  }
}

export class SalaryCalculator extends PaymentCalculator {
  protected override doPaycheck(paycheck: Paycheck): boolean {
    if (paycheck.employee.calculatorType !== PaymentCalculatorType.SALARY) {
      return true; // just continue to the next station
    }

    paycheck.amount = this.getEmployeeSalaryFromDatabase(paycheck.employee.id);
    return true;
  }

  private getEmployeeSalaryFromDatabase(_employeeId: string): number {
    return 1000;
  }
}

export class HourlyCalculator extends PaymentCalculator {
  protected override doPaycheck(paycheck: Paycheck): boolean {
    if (paycheck.employee.calculatorType !== PaymentCalculatorType.HOURLY) {
      return true; // just continue to the next station
    }

    paycheck.amount =
      this.getEmployeeHoursFromDatabase(paycheck.employee.id) *
      this.getEmployeeHourlyRateFromDatabase(paycheck.employee.id);
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
    if (paycheck.employee.disposerType !== PaymentDisposerType.DIRECT) {
      return true; // just continue to the next station
    }

    paycheck.deliveryMethod = this.getEmployeeBankAccountFromDatabase(paycheck.employee.id);
    this.deliver(paycheck);
    return true;
  }

  private getEmployeeBankAccountFromDatabase(_employeeId: string): string {
    return "accountNumber: 123456789";
  }
}

export class MailDisposer extends PaymentDisposer {
  protected doPaycheck(paycheck: Paycheck): boolean {
    if (paycheck.employee.disposerType !== PaymentDisposerType.MAIL) {
      return true; // just continue to the next station
    }

    paycheck.deliveryMethod = this.getEmployeeAddressFromDatabase(paycheck.employee.id);
    this.deliver(paycheck);
    return true;
  }

  private getEmployeeAddressFromDatabase(_employeeId: string): string {
    return "address: 123 Main St.";
  }
}

export class Payroll {
  constructor(private employees: Employee[]) {}

  payday(): void {
    const startingPaycheckStation = this.buildTheChain();

    for (const employee of this.employees) {
      const paycheck = this.getEmptyPaycheckForEmployee(employee);
      startingPaycheckStation.handlePaycheck(paycheck);
    }
  }

  private buildTheChain() {
    return (
      //
      new MonthlyPaymentScheduler(
        //
        new BiWeeklyPaymentScheduler(
          //
          new SalaryCalculator(
            //
            new HourlyCalculator(
              //
              new DirectDepositDisposer(
                //
                new MailDisposer()
              )
            )
          )
        )
      )
    );
  }

  private getEmptyPaycheckForEmployee(employee: Employee): Paycheck {
    return { employee, date: new Date(), amount: 0, shouldGetPaid: false, deliveryMethod: "" };
  }
}
