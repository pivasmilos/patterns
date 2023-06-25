export class Calculator {
  public calculateSum(data: number[]): number {
    return data.reduce((sum, value) => sum + value, 0);
  }

  public calculateAverage(sum: number, count: number): number {
    return count === 0 ? 0 : sum / count;
  }

  public getAverage(data: number[]): number {
    const sum = this.calculateSum(data);
    const average = this.calculateAverage(sum, data.length);
    return average;
  }
}

export class Presenter {
  private readonly calculator = new Calculator();

  constructor(private readonly data: number[]) {}

  public displayData(): void {
    const average = this.calculator.getAverage(this.data);
    console.log(`Average: ${average}`);
  }
}
