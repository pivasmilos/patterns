import { AFileTransferProtocol } from "./AFileTransferProtocol";

export class UdpFileTransferProtocol extends AFileTransferProtocol {
  sendPacket(packet: string): void {
    console.log(`Sending ${packet} via UDP`);
  }
}
