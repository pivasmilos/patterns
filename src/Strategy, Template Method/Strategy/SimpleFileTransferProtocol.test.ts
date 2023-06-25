import { setup, teardown } from "../../testUtils";
import {
  TcpPacketTransferProtocol,
  SimpleFileTransferProtocol,
  UdpPacketTransferProtocol,
} from "./SimpleFileTransferProtocol";

describe("Strategy pattern", () => {
  // If you want to be able to change the behavior of an object during runtime,
  // use delegation i.e. the Strategy pattern.

  // If you just want to be able to use different behaviors at compile time,
  // you can use inheritance i.e. the Template Method pattern.

  beforeEach(setup);
  afterEach(teardown);

  test("should send file via TCP", () => {
    const tcpPacketTransferProtocol = new TcpPacketTransferProtocol();
    const simpleFileTransferProtocol = new SimpleFileTransferProtocol(tcpPacketTransferProtocol);

    simpleFileTransferProtocol.sendFile("test.txt");

    expect(console.log).toHaveBeenCalledWith("Sending test.txt via FTP");
    expect(console.log).toHaveBeenCalledWith("Sending Packet from test.txt via TCP");
  });

  test("should send file via UDP", () => {
    const udpPacketTransferProtocol = new UdpPacketTransferProtocol();
    const simpleFileTransferProtocol = new SimpleFileTransferProtocol(udpPacketTransferProtocol);

    simpleFileTransferProtocol.sendFile("test.txt");

    expect(console.log).toHaveBeenCalledWith("Sending test.txt via FTP");
    expect(console.log).toHaveBeenCalledWith("Sending Packet from test.txt via UDP");
  });

  test("should change packet transfer protocol at runtime", () => {
    const tcpPacketTransferProtocol = new TcpPacketTransferProtocol();
    const udpPacketTransferProtocol = new UdpPacketTransferProtocol();
    const simpleFileTransferProtocol = new SimpleFileTransferProtocol(tcpPacketTransferProtocol);

    simpleFileTransferProtocol.sendFile("test.txt");

    expect(console.log).toHaveBeenCalledWith("Sending test.txt via FTP");
    expect(console.log).toHaveBeenCalledWith("Sending Packet from test.txt via TCP");

    simpleFileTransferProtocol.packetTransferProtocol = udpPacketTransferProtocol;
    simpleFileTransferProtocol.sendFile("test.txt");

    expect(console.log).toHaveBeenCalledWith("Sending test.txt via FTP");
    expect(console.log).toHaveBeenCalledWith("Sending Packet from test.txt via UDP");
  });
});
