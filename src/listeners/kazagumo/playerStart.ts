import { KazagumoPlayer, KazagumoTrack } from 'kazagumo'

import { Client } from '../../structures/Client'
import { Event } from '../../structures/Event'


export default class playerStartEvent extends Event {
  constructor(client: Client) {
    super(client, 'playerStart', true)
  }

  async execute(client: Client, player: KazagumoPlayer, track: KazagumoTrack) {
    if (track.isStream) return

  }
}