import { BusinessLogic } from "./BusinessLogic";

export interface PullObserver {
  update(): void;
}

export abstract class PullSubject implements BusinessLogic {
  private readonly observers = new Set<PullObserver>();

  public addObserver(observer: PullObserver): void {
    this.observers.add(observer);
  }

  public removeObserver(observer: PullObserver): void {
    this.observers.delete(observer);
  }

  public notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update();
    }
  }

  abstract setMessage(message: string): void;
  abstract getMessage(): string;
}
export class ConcretePullObserver implements PullObserver {
  constructor(private readonly name: string, private readonly subject: PullSubject) {}

  public update(): void {
    console.log(`${this.name} received message: ${this.subject.getMessage()}`);
  }
}

export class ConcretePullSubject extends PullSubject {
  private message = "";

  public setMessage(message: string): void {
    this.message = message;
    this.notifyObservers();
  }

  public getMessage(): string {
    return this.message;
  }
}
