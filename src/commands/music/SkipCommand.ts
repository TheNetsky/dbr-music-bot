import { Command } from 'eris'
import { Client } from 'src/base/Client'


export default class SkipCommand extends Command {
  constructor(public client: Client) {
    super('skip', async (msg) => {

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

        if (!this.client.utils.passedUserRequirements(msg, guildPlayer)) return

        guildPlayer.stop()

        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            description: '👌 | Skipped current track.'
          })]
        })
        return

      } catch (e) {
        this.client.logger.error(e.message)
        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            color: 'YELLOW',
            description: '⛔ | An error occured.'
          })]
        })
        return
      }
    },
      {
        aliases: ['s'],
        description: 'Skip current playing track.'
      })
  }
  public category = 'Music'
}