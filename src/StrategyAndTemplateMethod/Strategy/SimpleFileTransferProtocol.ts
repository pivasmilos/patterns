import { FileTransferProtocol } from "../FileTransferProtocol";
import { PacketTransferProtocol } from "../PacketTransferProtocol";

export class TcpPacketTransferProtocol implements PacketTransferProtocol {
  sendPacket(packet: string): void {
    console.log(`Sending ${packet} via TCP`);
  }
}

export class UdpPacketTransferProtocol implements PacketTransferProtocol {
  sendPacket(packet: string): void {
    console.log(`Sending ${packet} via UDP`);
  }
}

export class SimpleFileTransferProtocol implements FileTransferProtocol {
  constructor(
    /**
     * We keep the context for the protocol i.e. the strategy here.
     */
    private _packetTransferProtocol: PacketTransferProtocol
  ) {}

  /**
   * Use this setter to change the strategy at runtime.
   */
  public set packetTransferProtocol(protocol: PacketTransferProtocol) {
    this._packetTransferProtocol = protocol;
  }

  sendFile(fileName: string): void {
    const packet = this.getPacketFromFile(fileName);
    console.log(`Sending ${fileName} via FTP`);
    this._packetTransferProtocol.sendPacket(packet);
  }

  private getPacketFromFile(fileName: string): string {
    return `Packet from ${fileName}`;
  }
}
