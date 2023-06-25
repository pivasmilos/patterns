import { FileTransferProtocol } from "../FileTransferProtocol";
import { PacketTransferProtocol } from "../PacketTransferProtocol";

export abstract class AFileTransferProtocol implements FileTransferProtocol, PacketTransferProtocol {
  sendFile(fileName: string): void {
    const packet = this.getPacketFromFile(fileName);
    console.log(`Sending ${fileName} via FTP`);
    this.sendPacket(packet);
  }

  private getPacketFromFile(fileName: string): string {
    return `Packet from ${fileName}`;
  }

  /**
   * This is the template method that will be implemented by the subclasses.
   */
  abstract sendPacket(packet: string): void;
}

export class TcpFileTransferProtocol extends AFileTransferProtocol {
  sendPacket(packet: string): void {
    console.log(`Sending ${packet} via TCP`);
  }
}

export class UdpFileTransferProtocol extends AFileTransferProtocol {
  sendPacket(packet: string): void {
    console.log(`Sending ${packet} via UDP`);
  }
}
