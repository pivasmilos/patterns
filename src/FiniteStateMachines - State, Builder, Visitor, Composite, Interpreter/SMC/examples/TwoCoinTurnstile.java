public abstract class TwoCoinTurnstile implements Turnstile {
public abstract void unhandledTransition(String state, String event);
private enum State {Locked,Alarming,FirstCoin,Unlocked}
private enum Event {Reset,Pass,Coin}
private State state = State.Locked;
private void setState(State s) {state = s;}
public void Reset() {handleEvent(Event.Reset);}
public void Pass() {handleEvent(Event.Pass);}
public void Coin() {handleEvent(Event.Coin);}
private void handleEvent(Event event) {
  switch(state) {
    case Locked:
  switch(event) {
    case Pass:
      setState(State.Alarming);
      alarmOn();
      break;
    case Coin:
      setState(State.FirstCoin);
      break;
    case Reset:
      setState(State.Locked);
      lock();
      break;
    default: unhandledTransition(state.name(), event.name()); break;
  }
      break;
    case Alarming:
  switch(event) {
    case Reset:
      setState(State.Locked);
      alarmOff();
      lock();
      break;
    default: unhandledTransition(state.name(), event.name()); break;
  }
      break;
    case FirstCoin:
  switch(event) {
    case Pass:
      setState(State.Alarming);
      alarmOn();
      break;
    case Coin:
      setState(State.Unlocked);
      unlock();
      break;
    case Reset:
      setState(State.Locked);
      lock();
      break;
    default: unhandledTransition(state.name(), event.name()); break;
  }
      break;
    case Unlocked:
  switch(event) {
    case Pass:
      setState(State.Locked);
      lock();
      break;
    case Coin:
      setState(State.Unlocked);
      thankyou();
      break;
    case Reset:
      setState(State.Locked);
      lock();
      break;
    default: unhandledTransition(state.name(), event.name()); break;
  }
      break;
  }
}
}
