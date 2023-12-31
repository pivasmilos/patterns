/**
 * A POSIX timestamp.
 */

export type PosixTime = number;
/**
 * Describes when to execute commands.
 */

export class Schedule {
  constructor(private readonly date: Date) {}

  public get executionTime(): PosixTime {
    return this.date.getTime();
  }
}
