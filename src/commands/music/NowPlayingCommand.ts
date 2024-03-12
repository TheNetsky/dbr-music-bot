import { Command } from 'eris'

import { Client } from '../../structures/Client'


export default class NowPlayingCommand extends Command {
  constructor(public client: Client) {
    super('nowplaying', async (msg) => {

      try {
        const guildPlayer = this.client.kazagumo.players.get(msg.guildID as string)
        if (!guildPlayer) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | There no music playing in this guild.'
            }, 'YELLOW')]
          })
          return
        }

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            title: `${guildPlayer.queue.current?.title}`,
            url: `${guildPlayer.queue.current?.uri}`,
            author: {
              name: 'Currently Being Played',
              url: `${guildPlayer.queue.current?.uri}`
            },
            thumbnail: {
              url: `${guildPlayer.queue.current?.thumbnail}`
            },
            // @ts-expect-error Is valid
            description: `**Status:** \`${guildPlayer.loop !== 'none' ? 'Looping 🔂' : guildPlayer.paused ? 'Paused ⏸' : 'Playing ▶️'}\`\n\n**Length:** \`${guildPlayer.queue.current?.isStream ? 'Live 🔴' : this.client.utils.getDurationString(guildPlayer.queue.current?.length ?? 0)}\`\n\n**Requested by:** <@${guildPlayer.queue.current?.requester?.id}>`,
            fields: [
              {
                name: 'Next Up',
                value: `${guildPlayer.queue.length == 0 ? '`Nothing`' : `\`${guildPlayer.queue[0].title}\``}`,
                inline: false
              }
            ]
          }, 'YELLOW')]
        })

      } catch (e) {
        this.client.logger.error('CMD', e)
        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: '⛔ | An error occured.'
          }, 'RED')]
        })
        return
      }
    },
      {
        aliases: ['nowplaying', 'np'],
        description: 'Get the current playing track.',
        usage: 'nowplaying'
      })
  }
  public category = 'Music'
}