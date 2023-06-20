import { SimpleFileTransferProtocol } from "./SimpleFileTransferProtocol";
import { TcpPacketTransferProtocol } from "./TcpPacketTransferProtocol";
import { UdpPacketTransferProtocol } from "./UdpPacketTransferProtocol";

const ftp = new SimpleFileTransferProtocol(new TcpPacketTransferProtocol());

ftp.sendFile("file.txt");

// We can now change the strategy (protocl) at runtime! :D
ftp.packetTransferProtocol = new UdpPacketTransferProtocol();

ftp.sendFile("anotherFile.txt");

// If you want to be able to change the behavior of an object during runtime,
// use delegation i.e. the Strategy pattern.

// If you just want to be able to use different behaviors at compile time, you can use inheritance i.e. the Template Method pattern.
