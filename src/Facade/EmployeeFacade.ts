export class EmployeeFacade {
  constructor(private policy: EmployeePolicy, private gateway: EmployeeGateway, private reports: EmployeeReports) {}

  public save(): string {
    return this.gateway.save();
  }

  public getEmployeeWithPay(): string {
    return this.reports.describeEmployee() + ", Pay: " + this.policy.calculatePay();
  }
}

export class EmployeePolicy {
  public calculatePay(): string {
    return "Employee Pay";
  }
}

export class EmployeeGateway {
  public save(): string {
    return "Saved the Employee";
  }
}

export class EmployeeReports {
  public describeEmployee(): string {
    return "Name: John Doe, ID: 12345, Type: FT";
  }
}
