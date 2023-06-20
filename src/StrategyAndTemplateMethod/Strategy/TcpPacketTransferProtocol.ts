import { PacketTransferProtocol } from "../PacketTransferProtocol";

export class TcpPacketTransferProtocol implements PacketTransferProtocol {
  sendPacket(packet: string): void {
    console.log(`Sending ${packet} via TCP`);
  }
}
