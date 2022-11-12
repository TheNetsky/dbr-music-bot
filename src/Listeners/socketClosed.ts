import { Player } from 'erela.js'
import { Client } from '../Base/Client'

export default class listener {
  constructor(public client: Client) { }
  public type = 'once';
  public emitter = 'erela';
  public event = 'socketClosed'

  public async run(player: Player, payload) {
    const allowedOpCodes = ['4006', '4015', '4011', '4012']


    if (allowedOpCodes.includes(payload?.code)) {
      setTimeout(() => player.pause(true), 1000)
      setTimeout(() => player.pause(false), 2000)
      return true
    }
    return undefined
  }
}