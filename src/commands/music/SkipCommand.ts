import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class SkipCommand extends Command {
  constructor(public client: Client) {
    super('skip', async (msg) => {

      try {
        const guildPlayer = this.client.erela.players.get(msg.guildID as string)
        if (!guildPlayer) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              color: 'YELLOW',
              description: '⛔ | There no music playing in this guild.'
            })]
          })
          return
        }

        if (!this.client.utils.passedUserRequirements(msg, guildPlayer)) return

        guildPlayer.stop()

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
            color: 'YELLOW',
            description: '⛔ | An error occured.'
          })]
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