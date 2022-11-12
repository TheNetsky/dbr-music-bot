import { TextChannel } from 'eris'
import { Player, Track } from 'erela.js'
import { Client } from '../Base/Client'

export default class listener {
  constructor(public client: Client) { }
  public type = 'once';
  public emitter = 'erela';
  public event = 'trackStart'

  public async run(player: Player, track: Track) {
    const QueueChannel = this.client.getChannel(player.textChannel ?? '') as TextChannel
    if (!QueueChannel) return


    const sendMessage = await QueueChannel.createMessage({
      embeds: [this.client.utils.CreateEmbed('', {
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