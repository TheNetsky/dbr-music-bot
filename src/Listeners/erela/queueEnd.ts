import { Client } from '../../base/Client'
import { Event } from 'structures/Event'
import { Player } from 'erela.js'
import { TextChannel } from 'eris'


export default class queueEndEvent extends Event {
  constructor(client: Client) {
    super(client, 'queueEnd', true)
  }

  async execute(client: Client, player: Player) {
    if (!client.db.get(`${player.guild}_leaveOnQueueEnd`)) return

    const QueueChannel = client.getChannel(player.textChannel ?? '') as TextChannel
    if (!QueueChannel) return

    QueueChannel.createMessage({
      embeds: [client.utils.CreateEmbed({
        description: '⏹ | queue has ended.'
      })]
    })
    player.destroy()
  }
}