export class Calculator {
  public calculateSum(data: number[]): number {
    let sum = 0;
    for (const value of data) {
      sum += value;
    }
    return sum;
  }

  public calculateAverage(sum: number, count: number): number {
    if (count === 0) {
      return 0;
    }
    return sum / count;
  }

  public getAverage(data: number[]): number {
    const sum = this.calculateSum(data);
    const average = this.calculateAverage(sum, data.length);
    return average;
  }
}

export class Presenter {
  private readonly data: number[];
  private readonly calculator: Calculator;

  constructor(data: number[]) {
    this.data = data;
    this.calculator = new Calculator();
  }

  public displayData(): void {
    const average = this.calculator.getAverage(this.data);
    console.log(`Average: ${average}`);
  }
}