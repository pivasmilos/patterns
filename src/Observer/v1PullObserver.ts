import { BusinessLogic } from "./BusinessLogic";

export interface PullObserver {
  update(): void;
}

export abstract class PullSubject implements BusinessLogic {
  private observers: PullObserver[] = [];

  public addObserver(observer: PullObserver): void {
    this.observers.push(observer);
  }

  public removeObserver(observer: PullObserver): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
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
  private name: string;
  private subject: PullSubject;

  constructor(name: string, subject: PullSubject) {
    this.name = name;
    this.subject = subject;
  }

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
