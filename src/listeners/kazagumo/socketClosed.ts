import { Client } from 'structures/Client'
import { Event } from 'structures/Event'
import { KazagumoPlayer } from 'kazagumo'


export default class socketClosedEvent extends Event {
  constructor(client: Client) {
    super(client, 'socketClosed', true)
  }

  async execute(client: Client, player: KazagumoPlayer, payload) {
    const allowedOpCodes = ['4006', '4015', '4011', '4012']

    if (allowedOpCodes.includes(payload?.code)) {
      setTimeout(() => player.pause(true), 1000)
      setTimeout(() => player.pause(false), 2000)
      return true
    }
    
    return
  }
}