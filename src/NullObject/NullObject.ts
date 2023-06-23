export interface Employee {
  id: number;
  salary: number;
  tenure: number;
  canReceiveBonuses: boolean;
}

export class RegularEmployee implements Employee {
  constructor(public id: number, public salary: number, public tenure: number, public canReceiveBonuses = true) {}
}

export const NullEmployee: Employee = {
  id: -1,
  salary: 0,
  tenure: 0,
  canReceiveBonuses: false,
} as const;

export class EmployeeDatabase {
  private employees: Employee[] = [];
  private oneTimeBonus: number;

  constructor(oneTimeBonus = 0) {
    this.oneTimeBonus = oneTimeBonus;
  }

  public addEmployee(employee: Employee): void {
    this.employees.push(employee);
  }

  public getEmployeeById(id: number): Employee {
    const employee = this.employees.find((e) => e.id === id);
    return employee ? employee : NullEmployee;
  }

  public calculateTotalPayedAmount(): number {
    return this.employees.reduce(
      (total, employee) =>
        total + employee.salary * employee.tenure + (employee.canReceiveBonuses ? this.oneTimeBonus : 0),
      0
    );
  }
}
