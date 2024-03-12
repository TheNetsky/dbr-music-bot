import { KazagumoPlayer } from 'kazagumo'
import { TextChannel } from 'eris'

import { Client } from '../../structures/Client'
import { Event } from '../../structures/Event'


export default class playerEmptyEvent extends Event {
  constructor(client: Client) {
    super(client, 'playerEmpty', true)
  }

  async execute(client: Client, player: KazagumoPlayer) {
    const queueChannel = client.getChannel(player.textId as string) as TextChannel
    if (!queueChannel) return

    queueChannel.createMessage({
      embeds: [client.utils.createEmbed({
        description: '⏹ | queue has ended.'
      })]
    })

    if (!client.config.preferences.leaveQueueEnd) return

    player.destroy()
  }
}