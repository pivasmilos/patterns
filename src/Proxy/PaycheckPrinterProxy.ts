export interface PaycheckPrinter {
  printPaycheckMessage(message: string): void;
}

export interface NotificationAPI {
  sendNotification(message: string): void;
  addListener(listener: (message: string) => void): void;
}

export interface HardwarePrinter {
  id: string;
  configure(): void;
  print(message: string): void;
}

export class PaycheckPrinterProxy implements PaycheckPrinter {
  constructor(private readonly networkAPI: NotificationAPI) {}

  public printPaycheckMessage(message: string): void {
    this.networkAPI.sendNotification(`Printing paycheck message: ${message}`);
  }
}

export class NetworkAPI implements NotificationAPI {
  private readonly listeners: ((message: string) => void)[] = [];

  public sendNotification(message: string): void {
    console.log(`Sending notification: ${message}`);
    this.listeners.forEach((listener) => listener(message));
  }

  public addListener(listener: (message: string) => void): void {
    this.listeners.push(listener);
  }
}

export class PaycheckPrinterListener implements PaycheckPrinter {
  constructor(private readonly networkAPI: NotificationAPI, private readonly realPaycheckPrinter: PaycheckPrinter) {
    this.networkAPI.addListener((message) => this.onPaycheckPrinted(message));
  }

  public printPaycheckMessage(message: string): void {
    this.realPaycheckPrinter.printPaycheckMessage(message);
  }

  private onPaycheckPrinted(message: string): void {
    console.log(`Received notification: ${message}`);
    this.printPaycheckMessage(message);
  }
}

export class RealPaycheckPrinter implements PaycheckPrinter {
  constructor(private readonly hardwarePrinter: HardwarePrinter) {
    this.hardwarePrinter.configure();
  }

  public printPaycheckMessage(message: string): void {
    this.hardwarePrinter.print(message);
    console.log(`Paycheck message: ${message} printed via hardware printer: ${this.hardwarePrinter.id}`);
  }
}
