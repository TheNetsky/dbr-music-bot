import { Client } from '../../base/Client'
import { Event } from 'structures/Event'
import { Player, Track } from 'erela.js'
import { TextChannel } from 'eris'


export default class trackStartEvent extends Event {
  constructor(client: Client) {
    super(client, 'trackStart', true)
  }

  async execute(client: Client, player: Player, track: Track) {
    const QueueChannel = client.getChannel(player.textChannel ?? '') as TextChannel
    if (!QueueChannel) return


    const sendMessage = await QueueChannel.createMessage({
      embeds: [client.utils.CreateEmbed({
        title: `${track.title}`,
        url: `${track.uri}`,
        author: {
          name: 'Now Playing',
          url: `${track.uri}`,
        },
        //@ts-ignore
        description: `\`Length:\` ${track.isStream ? '\`Live 🔴\`' : this.client.utils.getDurationString(track.duration)}\n\n\`Requested by\`: <@${track.requester?.id}>`,
        thumbnail: {
          url: `${track.thumbnail}`
        },
        fields: [
          {
            name: 'Next Up',
            value: `${player.queue.length == 0 ? '\`Nothing\`' : `\`${player.queue[0].title}\``}`
          }
        ]
      })]
    })

    if (track.isStream) return
    setTimeout(() => sendMessage.delete(), track.duration)
  }
}