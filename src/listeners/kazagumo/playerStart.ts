import { KazagumoPlayer, KazagumoTrack } from 'kazagumo'
import { TextChannel } from 'eris'

import { Client } from '../../structures/Client'
import { Event } from '../../structures/Event'


export default class playerStartEvent extends Event {
  constructor(client: Client) {
    super(client, 'playerStart', true)
  }

  async execute(client: Client, player: KazagumoPlayer, track: KazagumoTrack) {
    const queueChannel = client.getChannel(player.textId as string) as TextChannel
    if (!queueChannel) return

    const sendMessage = await queueChannel.createMessage({
      embeds: [client.utils.createEmbed({
        title: `${track.title}`,
        url: `${track.uri}`,
        author: {
          name: 'Now Playing',
          url: `${track.uri}`
        },
        // @ts-expect-error Is valid
        description: `**Status:** \`${player.loop !== 'none' ? 'Looping 🔂' : player.paused ? 'Paused ⏸' : 'Playing ▶️'}\`\n\n**Length:** \`${track.isStream ? 'Live 🔴' : this.client.utils.getDurationString(track.length ?? 0)}\`\n\n**Requested by:** <@${track.requester.id}>`,
        thumbnail: {
          url: `${track.thumbnail}`
        },
        fields: [
          {
            name: 'Next Up',
            value: `${player.queue.length == 0 ? '`Nothing`' : `\`${player.queue[0].title}\``}`
          }
        ]
      })]
    })

    if (track.isStream) return

    setTimeout(() => sendMessage.delete(), track.length)
  }
}