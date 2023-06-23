/**
 * This solves the single responsibility principle violation in v1.
 *
 * The business logic is now decoupled from the observed Subject.
 * Instead of inheriting from the Subject, we now delegate.
 */

import { BusinessLogic } from "./BusinessLogic";

export interface PullObserverV2 {
  update(): void;
}

export interface PullObserverSubject {
  addObserver(observer: PullObserverV2): void;
  removeObserver(observer: PullObserverV2): void;
  notifyObservers(): void;
}

export interface PullSubjectV2 extends PullObserverSubject, BusinessLogic {}

export class PullSubjectImpl implements PullObserverSubject {
  private observers: PullObserverV2[] = [];

  public addObserver(observer: PullObserverV2): void {
    this.observers.push(observer);
  }

  public removeObserver(observer: PullObserverV2): void {
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
}

export class ObservedPullSubject implements PullSubjectV2 {
  private subject: PullSubjectImpl = new PullSubjectImpl();
  private message = "";

  public addObserver(observer: PullObserverV2): void {
    this.subject.addObserver(observer);
  }

  public removeObserver(observer: PullObserverV2): void {
    this.subject.removeObserver(observer);
  }

  public notifyObservers(): void {
    this.subject.notifyObservers();
  }

  public setMessage(message: string): void {
    this.message = message;
    this.notifyObservers();
  }

  public getMessage(): string {
    return this.message;
  }
}

export class ConcretePullObserverV2 implements PullObserverV2 {
  private name: string;
  private subject: PullSubjectV2;

  constructor(name: string, subject: PullSubjectV2) {
    this.name = name;
    this.subject = subject;
  }

  public update(): void {
    console.log(`${this.name} received message: ${this.subject.getMessage()}`);
  }
}
