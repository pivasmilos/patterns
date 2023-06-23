import { BusinessLogic } from "./BusinessLogic";

export interface PushObserver {
  update(message: string): void;
}

export interface PushObserverSubject {
  addObserver(observer: PushObserver): void;
  removeObserver(observer: PushObserver): void;
  notifyObservers(message: string): void;
}

export interface PushSubject extends PushObserverSubject, BusinessLogic {}

export class PushSubjectImpl implements PushObserverSubject {
  private observers: PushObserver[] = [];

  public addObserver(observer: PushObserver): void {
    this.observers.push(observer);
  }

  public removeObserver(observer: PushObserver): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  public notifyObservers(message: string): void {
    for (const observer of this.observers) {
      observer.update(message);
    }
  }
}

export class ObservedPushSubject implements PushSubject {
  private subject: PushSubjectImpl = new PushSubjectImpl();
  private message = "";

  public addObserver(observer: PushObserver): void {
    this.subject.addObserver(observer);
  }

  public removeObserver(observer: PushObserver): void {
    this.subject.removeObserver(observer);
  }

  public notifyObservers(message: string): void {
    this.subject.notifyObservers(message);
  }

  public setMessage(message: string): void {
    this.message = message;
    this.notifyObservers(message);
  }

  public getMessage(): string {
    return this.message;
  }
}

export class ConcretePushObserver implements PushObserver {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  public update(message: string): void {
    console.log(`${this.name} received message: ${message}`);
  }
}
