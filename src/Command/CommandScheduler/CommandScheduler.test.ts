import { setup, teardown } from "../../TestUtils/testUtils";
import { CommandScheduler } from "./CommandScheduler";
import { PosixTime, Schedule } from "./Schedule";
import { SimpleTimeScheduler } from "./SimpleTimeScheduler";

describe("CommandScheduler.execute", () => {
  beforeAll(setup);
  afterAll(teardown);

  it("executes the commands at given time", async () => {
    const record: PosixTime[] = [];
    const deltaMs = 100;
    const deltaMsTolerance = 100; // SimpleTimeScheduler is not very precise :(
    const scheduledTime = new Date(Date.now() + deltaMs);

    const sut = new CommandScheduler(
      new Schedule(scheduledTime),
      [
        {
          execute: () => {
            record.push(Date.now());
          },
        },
      ],
      new SimpleTimeScheduler()
    );

    sut.execute();

    await new Promise((resolve) => setTimeout(resolve, 2 * deltaMs));

    expect(record.length).toBe(1);

    const executedTime = record[0];
    if (executedTime === undefined) {
      return;
    }
    const timeDifference = Math.abs(executedTime - scheduledTime.getTime());
    expect(timeDifference).toBeLessThanOrEqual(deltaMsTolerance);
  });
});
