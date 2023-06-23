import { Calculator } from "./Presenter";

/**
 * This pattern is applied at the boundaries of the system,
 * where things are often difficult to test,
 * in order to make them more testable.
 * We accomplish the pattern by reducing the logic close to the boundary,
 * making the code close to the boundary so humble that it doesn't need to be tested.
 * The extracted logic is moved into another class, decoupled from the boundary which makes it testable.
 */
describe("Presenter", () => {
  /**
   * Calculator is easily testable, and the Presenter is a humble object which doesn't need to be tested.
   */
  describe("Calculator", () => {
    let calculator: Calculator;

    beforeEach(() => {
      calculator = new Calculator();
    });

    test("calculateSum returns correct sum", () => {
      const data = [1, 2, 3, 4, 5];
      const result = calculator.calculateSum(data);
      expect(result).toBe(15);
    });

    test("calculateAverage returns correct average", () => {
      const sum = 15;
      const count = 5;
      const result = calculator.calculateAverage(sum, count);
      expect(result).toBe(3);
    });

    test("getAverage returns correct average", () => {
      const data = [1, 2, 3, 4, 5];
      const result = calculator.getAverage(data);
      expect(result).toBe(3);
    });
  });
});
