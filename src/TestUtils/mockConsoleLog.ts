const consoleLog = console.log;

export function mockConsoleLog() {
  console.log = jest.fn();
}

export function restoreConsoleLog() {
  console.log = consoleLog;
}
