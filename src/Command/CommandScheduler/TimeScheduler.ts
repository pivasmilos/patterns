import { PosixTime } from "./Schedule";

/** Schedules callbacks to be executed at given time */
export interface TimeScheduler {
  /** Executes a callback at given time */
  scheduledCall(callback: () => void, time: PosixTime): NodeJS.Timeout;
}
