import { Command } from 'eris';
import { Client } from 'src/base/Client';


export default class PlayCommand extends Command {
  constructor(public client: Client) {
    super('nowplaying', async (msg, args) => {

      try {
        const GuildPlayers = this.client.erela.players.get(msg.guildID ?? '')
        if (!GuildPlayers) {
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
            title: `${GuildPlayers.trackRepeat ? '🔂' : GuildPlayers.paused ? '⏸' : '▶️'} | ${GuildPlayers.queue.current?.title}`,
            url: `${GuildPlayers.queue.current?.uri}`,
            author: {
              name: 'Currently Being Played',
              url: `${GuildPlayers.queue.current?.uri}`
            },
            thumbnail: {
              url: `${GuildPlayers.queue.current?.thumbnail}`
            },
            color: 'YELLOW',
            description: `\`Length:\` ${this.client.utils.getDurationString(GuildPlayers.queue.current?.duration)}\n\n\`Requested by\`: ${GuildPlayers.queue.current?.requester}`,
            fields: [
              {
                name: 'Next Up',
                value: `${GuildPlayers.queue.length == 0 ? '\`Nothing\`' : `\`${GuildPlayers.queue[0].title}\``}`
              }
            ]
          })]
        })

      } catch (e) {
        this.client.logger.error(e.message)
        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            color: 'RED',
            description: '⛔ | An error occured'
          })]
        })
        return
      }
    },
      {
        aliases: ['nowplaying', 'np'],
        description: 'Get the current playing song.',
        cooldown: 3000,
        argsRequired: false
      })
  }
  public category = 'Music'
}