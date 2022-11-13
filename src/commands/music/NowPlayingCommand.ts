import { Command } from 'eris'
import { Client } from 'src/base/Client'


export default class NowPlayingCommand extends Command {
  constructor(public client: Client) {
    super('nowplaying', async (msg) => {

      try {
        const guildPlayer = this.client.erela.players.get(msg.guildID ?? '')
        if (!guildPlayer) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: '⛔ | There no music playing in this guild.'
            })]
          })
          return
        }

        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            title: `${guildPlayer.trackRepeat ? '🔂' : guildPlayer.paused ? '⏸' : '▶️'} | ${guildPlayer.queue.current?.title}`,
            url: `${guildPlayer.queue.current?.uri}`,
            author: {
              name: 'Currently Being Played',
              url: `${guildPlayer.queue.current?.uri}`
            },
            thumbnail: {
              url: `${guildPlayer.queue.current?.thumbnail}`
            },
            color: 'YELLOW',
            description: `\`Length:\` ${this.client.utils.getDurationString(guildPlayer.queue.current?.duration)}\n\n\`Requested by\`: ${guildPlayer.queue.current?.requester}`,
            fields: [
              {
                name: 'Next Up',
                value: `${guildPlayer.queue.length == 0 ? '\`Nothing\`' : `\`${guildPlayer.queue[0].title}\``}`
              }
            ]
          })]
        })

      } catch (e) {
        this.client.logger.error(e.message)
        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            color: 'RED',
            description: '⛔ | An error occured.'
          })]
        })
        return
      }
    },
      {
        aliases: ['nowplaying', 'np'],
        description: 'Get the current playing song.'
      })
  }
  public category = 'Music'
}