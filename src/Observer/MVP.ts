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

/**
 * E.g. a DOM element.
 */
interface Stringable {
  toString(): string;
  fromString(value: string): void;
}

export class View {
  private readonly inputElement: Stringable;
  private readonly outputElement: Stringable;

  constructor(inputElement: Stringable, outputElement: Stringable) {
    this.inputElement = inputElement;
    this.outputElement = outputElement;
  }

  public getInputValue(): string {
    return this.inputElement.toString();
  }

  public setOutputValue(value: string): void {
    this.outputElement.fromString(value);
  }
}

export class Presenter {
  private readonly model: Model<string>;
  private readonly view: View;

  constructor(model: Model<string>, view: View) {
    this.model = model;
    this.view = view;
  }

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
