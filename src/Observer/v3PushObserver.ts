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
  private readonly observers = new Set<PushObserver>();

  public addObserver(observer: PushObserver): void {
    this.observers.add(observer);
  }

  public removeObserver(observer: PushObserver): void {
    this.observers.delete(observer);
  }

  public notifyObservers(message: string): void {
    for (const observer of this.observers) {
      observer.update(message);
    }
  }
}

export class ObservedPushSubject implements PushSubject {
  private readonly subject: PushSubjectImpl = new PushSubjectImpl();
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
  constructor(private readonly name: string) {}

  public update(message: string): void {
    console.log(`${this.name} received message: ${message}`);
  }
}
