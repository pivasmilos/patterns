import { PacketTransferProtocol } from "../PacketTransferProtocol";

export class UdpPacketTransferProtocol implements PacketTransferProtocol {
  sendPacket(packet: string): void {
    console.log(`Sending ${packet} via UDP`);
  }
}
