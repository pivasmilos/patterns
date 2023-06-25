import { Employee, RegularEmployee, NullEmployee, EmployeeDatabase } from "./NullObject";

describe("NullObject pattern", () => {
  describe("RegularEmployee", () => {
    it("should have correct properties", () => {
      const employee: Employee = new RegularEmployee(1, 5000, 2);

      expect(employee.id).toBe(1);
      expect(employee.salary).toBe(5000);
      expect(employee.tenure).toBe(2);
    });
  });

  describe("NullEmployee", () => {
    it("should have default properties", () => {
      const employee: Employee = NullEmployee;

      expect(employee.id).toBe(-1);
      expect(employee.salary).toBe(0);
      expect(employee.tenure).toBe(0);
    });
  });

  describe("EmployeeDatabase", () => {
    it("should add and retrieve employees", () => {
      const database: EmployeeDatabase = new EmployeeDatabase();
      const employee1: Employee = new RegularEmployee(1, 5000, 2);
      const employee2: Employee = new RegularEmployee(2, 6000, 3);

      database.addEmployee(employee1);
      database.addEmployee(employee2);

      const retrievedEmployee1: Employee = database.getEmployeeById(1);
      const retrievedEmployee2: Employee = database.getEmployeeById(2);
      const retrievedEmployee3: Employee = database.getEmployeeById(3);
      expect(retrievedEmployee1).toEqual(employee1);
      expect(retrievedEmployee2).toEqual(employee2);
      expect(retrievedEmployee3).toBe(NullEmployee);
    });

    it("should calculate total payed amount", () => {
      const database: EmployeeDatabase = new EmployeeDatabase();
      const employee1: Employee = new RegularEmployee(1, 5000, 2);
      const employee2: Employee = new RegularEmployee(2, 6000, 3);
      database.addEmployee(employee1);
      database.addEmployee(employee2);

      const totalPayedAmount: number = database.calculateTotalPayedAmount();

      // 2*5 + 3*6 = 28
      expect(totalPayedAmount).toBe(28000);
    });

    it("should calculate total payed amount", () => {
      const database: EmployeeDatabase = new EmployeeDatabase();
      const employee1: Employee = new RegularEmployee(1, 5000, 2);
      const employee2: Employee = new RegularEmployee(2, 6000, 3);
      database.addEmployee(employee1);
      database.addEmployee(employee2);

      const totalPayedAmount: number = database.calculateTotalPayedAmount();

      // 2*5 + 3*6 = 28
      expect(totalPayedAmount).toBe(28000);
    });

    it("should calculate total payed amount with one-time bonus", () => {
      const database: EmployeeDatabase = new EmployeeDatabase(1000);
      const employee1: Employee = new RegularEmployee(1, 5000, 2);
      const employee2: Employee = new RegularEmployee(2, 6000, 3);
      database.addEmployee(employee1);
      database.addEmployee(employee2);

      const totalPayedAmount: number = database.calculateTotalPayedAmount();

      // 2*5 + 3*6 + 1 + 1 = 30
      expect(totalPayedAmount).toBe(30000);
    });

    it("should calculate total payed amount disregarding NullEmployees", () => {
      const database: EmployeeDatabase = new EmployeeDatabase(1000);
      const employee1: Employee = new RegularEmployee(1, 5000, 2);
      const employee2: Employee = new RegularEmployee(2, 6000, 3);
      database.addEmployee(employee1);
      database.addEmployee(employee2);
      const aBunchOfNullEmployees = Array.from({ length: 42000 }, () => NullEmployee);
      aBunchOfNullEmployees.forEach((e) => database.addEmployee(e));

      const totalPayedAmount: number = database.calculateTotalPayedAmount();

      // 2*5 + 3*6 + 1 + 1 = 30 still
      expect(totalPayedAmount).toBe(30000);
    });
  });
});
