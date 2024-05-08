import { KazagumoPlayer, PlayerMovedChannels, PlayerMovedState } from 'kazagumo'

import { Client } from '../../structures/Client'
import { Event } from '../../structures/Event'


export default class playerMovedEvent extends Event {
  constructor(client: Client) {
    super(client, 'playerMoved', true)
  }

  async execute(client: Client, player: KazagumoPlayer, state: PlayerMovedState, channels: PlayerMovedChannels) {

    if (state === 'MOVED') {
      try {
        player.setVoiceChannel(channels.newChannelId ? channels.newChannelId : player.voiceId ? player.voiceId : '')
      } catch (e) {
        player.destroy()
      }

      setTimeout(() => player.pause(false), 3000)
      return
    }
  }
} 