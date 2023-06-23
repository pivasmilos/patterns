export class Model {
  private data: string;

  constructor() {
    this.data = "";
  }

  public getData(): string {
    return this.data;
  }

  public setData(data: string): void {
    this.data = data;
  }
}

export class View {
  private readonly model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  public render(): void {
    // the View observes the Model here.
    // this is the pull model observer because the View is pulling data from the Model.
    console.log(`View: ${this.model.getData()}`);
  }
}

export class Controller {
  private readonly model: Model;
  private readonly view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
  }

  public updateData(data: string): void {
    this.model.setData(data);
    this.view.render();
  }
}
