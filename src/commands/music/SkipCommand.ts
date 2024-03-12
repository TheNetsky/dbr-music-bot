import { Command } from 'eris'

import { Client } from '../../structures/Client'


export default class SkipCommand extends Command {
  constructor(public client: Client) {
    super('skip', async (msg) => {

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

        if (!this.client.utils.passedUserRequirements(msg, guildPlayer)) return

        guildPlayer.shoukaku.stopTrack()

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: '⏭ | Skipped current track.'
          })]
        })
        return

      } catch (e) {
        this.client.logger.error('CMD', e)
        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: '⛔ | An error occured.'
          }, 'YELLOW')]
        })
        return
      }
    },
      {
        aliases: ['s'],
        description: 'Skip current playing track.',
        usage: 'skip'
      })
  }
  public category = 'Music'
}