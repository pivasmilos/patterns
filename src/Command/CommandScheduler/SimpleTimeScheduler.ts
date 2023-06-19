import { PosixTime } from "./Schedule";
import { TimeScheduler } from "./TimeScheduler";

/**
 * Simple implementation of TimeScheduler which uses setTimeout.
 *
 * @see setTimeout
 */
export class SimpleTimeScheduler implements TimeScheduler {
  public scheduledCall(fn: () => void, time: PosixTime): NodeJS.Timeout {
    // TODO consider using something more precise than setTimeout.
    // It has no guarantees on the precision.
    return setTimeout(fn, time - Date.now());
  }
}
