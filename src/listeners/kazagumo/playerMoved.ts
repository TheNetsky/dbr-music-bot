import { KazagumoPlayer } from 'kazagumo'
import { VoiceChannel } from 'eris'

import { Client } from '../../structures/Client'
import { Event } from '../../structures/Event'


export default class playerMovedEvent extends Event {
  constructor(client: Client) {
    super(client, 'playerMoved', true)
  }

  async execute(client: Client, player: KazagumoPlayer, oldChannel: VoiceChannel, newChannel: VoiceChannel) {

    try {
      player.setVoiceChannel(newChannel.id ?? player.textId)
    } catch (e) {
      player.destroy()
    }

    player.textId = newChannel.id
    setTimeout(() => player.pause(false), 3000)
    return
  }
}