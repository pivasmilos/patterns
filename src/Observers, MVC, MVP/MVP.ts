/**
 * The main difference between the MVP and MVC patterns is the way the user
 * interface is updated.
 *
 * In the MVP pattern, the Presenter updates the View directly, whereas in the
 * MVC pattern, the Model updates the View indirectly through the Controller.
 *
 * The MVP pattern is often used in web applications where the user interface is
 * more complex and requires more logic to update.
 */

export class Model<T> {
  private data: T | null = null;

  public getData(): T | null {
    return this.data;
  }

  public setData(data: T): boolean {
    const hasChanged = this.data !== data;
    this.data = data;
    return hasChanged;
  }
}

interface ToStringable {
  toString(): string;
}

interface FromStringable {
  fromString(value: string): void;
}

export class View {
  constructor(private readonly inputElement: ToStringable, private readonly outputElement: FromStringable) {}

  public getInputValue(): string {
    return this.inputElement.toString();
  }

  public setOutputValue(value: string): void {
    this.outputElement.fromString(value);
  }
}

export class Presenter {
  constructor(private readonly model: Model<string>, private readonly view: View) {}

  public handleInputChange(): void {
    const inputValue = this.view.getInputValue();
    const shouldUpdate = this.model.setData(inputValue);

    if (!shouldUpdate) {
      return;
    }

    const outputValue = this.model.getData()?.toString() ?? "";
    this.view.setOutputValue(outputValue);
  }
}
