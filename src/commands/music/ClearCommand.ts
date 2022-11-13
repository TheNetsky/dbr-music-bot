
import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class ClearCommand extends Command {
  constructor(public client: Client) {
    super('clear', async (msg) => {

      try {
        const guildPlayer = this.client.erela.players.get(msg.guildID ?? '')
        if (!guildPlayer) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              description: '⛔ | There no music playing in this guild.'
            })]
          })
          return
        }

        if (!this.client.utils.passedUserRequirements(msg, guildPlayer)) return

        guildPlayer.queue.clear()

        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            description: '💥 | Queue has been cleared!'
          })]
        })
        return

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
        aliases: ['clean', 'empty', 'nuke'],
        description: 'Clear the queue.'
      })
  }
  public category = 'Music'
}