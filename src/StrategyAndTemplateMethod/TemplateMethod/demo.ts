import { TcpFileTransferProtocol } from "./TcpFileTransferProtocol";
import { UdpFileTransferProtocol } from "./UdpFileTransferProtocol";

const ftp = new UdpFileTransferProtocol();
ftp.sendFile("file.txt");

// Now to change the packet transfer protocol at runtime
// we can't just change the property like with the strategy.
// We need to create a new instance of the class:
const ftp2 = new TcpFileTransferProtocol();
ftp2.sendFile("file2.txt");

// Actually, we could do this in JS, but it's not a good practice.
ftp.sendPacket = TcpFileTransferProtocol.prototype.sendPacket;
ftp.sendFile("anotherFile.txt");
// Debugging this would be a nightmare.
// ftp is of type UdpFileTransferProtocol, so we would expect it to use UDP.
// But it's using TCP. Why? Because we changed the sendPacket method.

// If you want to be able to change the behavior of an object during runtime,
// use delegation i.e. the Strategy pattern.

// If you just want to be able to use different behaviors at compile time, you can use inheritance i.e. the Template Method pattern.
