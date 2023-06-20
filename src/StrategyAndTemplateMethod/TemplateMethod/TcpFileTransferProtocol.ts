import { AFileTransferProtocol } from "./AFileTransferProtocol";

export class TcpFileTransferProtocol extends AFileTransferProtocol {
  sendPacket(packet: string): void {
    console.log(`Sending ${packet} via TCP`);
  }
}
