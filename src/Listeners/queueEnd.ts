import { Player } from 'erela.js'
import { TextChannel } from 'eris';
import { Client } from '../Base/Client'

export default class listener {
  constructor(public client: Client) { }
  public type = 'once';
  public emitter = 'erela';
  public event = 'queueEnd'

  public async run(player: Player) {
    if (!this.client.db.get(`${player.guild}_leaveOnQueueEnd`)) return

    const QueueChannel = this.client.getChannel(player.textChannel ?? '') as TextChannel
    if (!QueueChannel) return

    QueueChannel.createMessage({
      embeds: [this.client.utils.CreateEmbed('', {
        description: '⏹ | queue has ended.'
      })]
    })
    player.destroy()
  }
}