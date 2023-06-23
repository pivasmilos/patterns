import { ConcretePullObserver, ConcretePullSubject, PullObserver, PullSubject } from "./v1PullObserver";
import { ObservedPullSubject, ConcretePullObserverV2, PullSubjectV2, PullObserverV2 } from "./v2PullObserverDecoupled";
import { PushObserver, ConcretePushObserver, ObservedPushSubject, PushSubject } from "./v3PushObserver";

describe("Observers", () => {
  describe("Pull Observer Pattern", () => {
    let subject: PullSubject;
    let observer1: PullObserver;
    let observer2: PullObserver;

    beforeEach(() => {
      subject = new ConcretePullSubject();
      observer1 = new ConcretePullObserver("Observer 1", subject);
      observer2 = new ConcretePullObserver("Observer 2", subject);
      subject.addObserver(observer1);
      subject.addObserver(observer2);
    });

    test("observers receive message when subject updates", () => {
      const spy1 = jest.spyOn(observer1, "update");
      const spy2 = jest.spyOn(observer2, "update");

      subject.setMessage("Hello, observers!");

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });

    test("observers do not receive message after being removed", () => {
      const spy1 = jest.spyOn(observer1, "update");
      const spy2 = jest.spyOn(observer2, "update");

      subject.removeObserver(observer2);
      subject.setMessage("Goodbye, observer 2!");

      expect(spy1).toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
    });

    test("observers receive correct message", () => {
      const spy1 = jest.spyOn(console, "log");

      subject.setMessage("Hello, observers!");

      expect(spy1).toHaveBeenCalledWith("Observer 1 received message: Hello, observers!");
      expect(spy1).toHaveBeenCalledWith("Observer 2 received message: Hello, observers!");
    });
  });

  describe("Pull Observer Pattern V2", () => {
    let subject: PullSubjectV2;
    let observer1: PullObserverV2;
    let observer2: PullObserverV2;

    beforeEach(() => {
      subject = new ObservedPullSubject();
      observer1 = new ConcretePullObserverV2("Observer 1", subject);
      observer2 = new ConcretePullObserverV2("Observer 2", subject);
      subject.addObserver(observer1);
      subject.addObserver(observer2);
    });

    test("observers receive message when subject updates", () => {
      const spy1 = jest.spyOn(observer1, "update");
      const spy2 = jest.spyOn(observer2, "update");

      subject.setMessage("Hello, observers!");

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });

    test("observers do not receive message after being removed", () => {
      const spy1 = jest.spyOn(observer1, "update");
      const spy2 = jest.spyOn(observer2, "update");

      subject.removeObserver(observer2);
      subject.setMessage("Goodbye, observer 2!");

      expect(spy1).toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
    });

    test("observers receive correct message", () => {
      const spy1 = jest.spyOn(console, "log");

      subject.setMessage("Hello, observers!");

      expect(spy1).toHaveBeenCalledWith("Observer 1 received message: Hello, observers!");
      expect(spy1).toHaveBeenCalledWith("Observer 2 received message: Hello, observers!");
    });
  });

  describe("Push Observer Pattern V3", () => {
    let subject: PushSubject;
    let observer1: PushObserver;
    let observer2: PushObserver;

    beforeEach(() => {
      subject = new ObservedPushSubject();
      // note that the push observers are not passed the subject anymore
      observer1 = new ConcretePushObserver("Observer 1");
      observer2 = new ConcretePushObserver("Observer 2");
      subject.addObserver(observer1);
      subject.addObserver(observer2);
    });

    test("observers receive message when subject updates", () => {
      const spy1 = jest.spyOn(observer1, "update");
      const spy2 = jest.spyOn(observer2, "update");

      subject.setMessage("Hello, observers!");

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });

    test("observers do not receive message after being removed", () => {
      const spy1 = jest.spyOn(observer1, "update");
      const spy2 = jest.spyOn(observer2, "update");

      subject.removeObserver(observer2);
      subject.setMessage("Goodbye, observer 2!");

      expect(spy1).toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
    });

    test("observers receive correct message", () => {
      const spy1 = jest.spyOn(console, "log");

      subject.setMessage("Hello, observers!");

      expect(spy1).toHaveBeenCalledWith("Observer 1 received message: Hello, observers!");
      expect(spy1).toHaveBeenCalledWith("Observer 2 received message: Hello, observers!");
    });
  });
});
