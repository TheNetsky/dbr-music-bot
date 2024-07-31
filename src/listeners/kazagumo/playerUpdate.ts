import { KazagumoPlayer } from 'kazagumo'

import { Client } from '../../structures/Client'
import { Event } from '../../structures/Event'

let localStore: string

export default class playerUpdateEvent extends Event {
  constructor(client: Client) {
    super(client, 'playerUpdate', false)
  }

  async execute(client: Client, player: KazagumoPlayer) {
    const nowPlaying = player.queue.current

    if (!nowPlaying?.identifier) {
      return
    }

    if (localStore === nowPlaying.identifier) {
      return
    }

    localStore = nowPlaying.identifier

    await this.client.utils.nowPlayingEmbed(player)

    if (client.config.preferences.playingAsPresence) {
      client.editStatus('online', { name: `${nowPlaying.title}`, type: 2 })
    } else {
      client.editStatus('online', { name: 'Buurman & Buurman, B2B!', type: 2 })
    }

  }
}