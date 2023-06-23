interface Observer {
  update(): void;
}

export class Model {
  private data: string;
  private observers: Observer[];

  constructor() {
    this.data = "";
    this.observers = [];
  }

  public getData(): string {
    return this.data;
  }

  public setData(data: string): void {
    this.data = data;
    this.notifyObservers();
  }

  public addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  public removeObserver(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update();
    }
  }
}

export class View implements Observer {
  private readonly model: Model;

  constructor(model: Model) {
    this.model = model;
    this.model.addObserver(this);
  }

  public update(): void {
    console.log(`View: ${this.model.getData()}`);
  }
}

export class Controller {
  private readonly model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  public updateData(data: string): void {
    this.model.setData(data);
  }
}
