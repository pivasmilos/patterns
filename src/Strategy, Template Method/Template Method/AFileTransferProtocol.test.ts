import { setup, teardown } from "../../testUtils";
import { TcpFileTransferProtocol, UdpFileTransferProtocol } from "./AFileTransferProtocol";

describe("Template Method pattern", () => {
  // If you want to be able to change the behavior of an object during runtime,
  // use delegation i.e. the Strategy pattern.

  // If you just want to be able to use different behaviors at compile time,
  // you can use inheritance i.e. the Template Method pattern.
  // But you won't be able to change the templated method.
  // (Actually, you could do this in JS through reassigning the function in the object to
  // the one you extracted from different class prototype, but it's not a good practice.
  // It breaks encapsulation, would be a nightmare to debug etc.)

  beforeEach(setup);
  afterEach(teardown);

  test("should send file via TCP", () => {
    const tcpFileTransferProtocol = new TcpFileTransferProtocol();

    tcpFileTransferProtocol.sendFile("test.txt");

    expect(console.log).toHaveBeenCalledWith("Sending test.txt via FTP");
    expect(console.log).toHaveBeenCalledWith("Sending Packet from test.txt via TCP");
  });

  test("should send file via UDP", () => {
    const udpFileTransferProtocol = new UdpFileTransferProtocol();

    udpFileTransferProtocol.sendFile("test.txt");

    expect(console.log).toHaveBeenCalledWith("Sending test.txt via FTP");
    expect(console.log).toHaveBeenCalledWith("Sending Packet from test.txt via UDP");
  });
});
