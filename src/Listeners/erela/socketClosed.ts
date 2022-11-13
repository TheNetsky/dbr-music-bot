import { Client } from '../../base/Client'
import { Event } from 'structures/Event'
import { Player } from 'erela.js'


export default class socketClosedEvent extends Event {
  constructor(client: Client) {
    super(client, 'socketClosed', true)
  }

  async execute(client: Client, player: Player, payload) {
    const allowedOpCodes = ['4006', '4015', '4011', '4012']

    if (allowedOpCodes.includes(payload?.code)) {
      setTimeout(() => player.pause(true), 1000)
      setTimeout(() => player.pause(false), 2000)
      return true
    }
    return undefined
  }
}