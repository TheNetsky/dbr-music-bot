import { Client } from 'structures/Client'
import { Event } from 'structures/Event'
import { VoicePacket } from 'erela.js';


export default class rawWSEvent extends Event {
  constructor(client: Client) {
    super(client, 'rawWS', false)
  }

  async execute(client: Client, packet: VoicePacket) {
    client.erela.updateVoiceState(packet)
  }
}