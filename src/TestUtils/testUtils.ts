import { mockConsoleLog, restoreConsoleLog } from "./mockConsoleLog";

/**
 * Call this function in the beforeAll() function of your test suite.
 *
 * For now, this function only mocks the console.log() function.
 */
export function setup() {
  mockConsoleLog();
}

/**
 * Call this function in the afterAll() function of your test suite.
 *
 * For now, this function only restores the mocked console.log() function.
 */
export function teardown() {
  restoreConsoleLog();
}
