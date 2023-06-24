import { EmployeePolicy, EmployeeGateway, EmployeeReports, EmployeeFacade } from "./EmployeeFacade";

describe("EmployeeFacade", () => {
  let policy: EmployeePolicy;
  let gateway: EmployeeGateway;
  let reports: EmployeeReports;
  let facade: EmployeeFacade;

  beforeEach(() => {
    policy = new EmployeePolicy();
    gateway = new EmployeeGateway();
    reports = new EmployeeReports();
    facade = new EmployeeFacade(policy, gateway, reports);
  });

  describe("save", () => {
    it("returns a success message", () => {
      const result = facade.save();
      expect(result).toBe("Saved the Employee");
    });
  });

  describe("getEmployeeWithPay", () => {
    it("returns the employee description with pay", () => {
      const result = facade.getEmployeeWithPay();
      expect(result).toBe("Name: John Doe, ID: 12345, Type: FT, Pay: Employee Pay");
    });
  });
});
