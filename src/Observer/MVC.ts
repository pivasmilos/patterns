interface Observer {
  update(): void;
}

export class Model {
  private data: string;
  private readonly observers = new Set<Observer>();

  constructor() {
    this.data = "";
  }

  public getData(): string {
    return this.data;
  }

  public setData(data: string): void {
    this.data = data;
    this.notifyObservers();
  }

  public addObserver(observer: Observer): void {
    this.observers.add(observer);
  }

  public removeObserver(observer: Observer): void {
    this.observers.delete(observer);
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update();
    }
  }
}

export class View implements Observer {
  constructor(private readonly model: Model) {
    this.model.addObserver(this);
  }

  public update(): void {
    console.log(`View: ${this.model.getData()}`);
  }
}

export class Controller {
  constructor(private readonly model: Model) {}

  public updateData(data: string): void {
    this.model.setData(data);
  }
}
