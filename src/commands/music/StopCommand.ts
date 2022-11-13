import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class StopCommand extends Command {
  constructor(public client: Client) {
    super('stop', async (msg) => {

      try {
        const guildPlayer = this.client.erela.players.get(msg.guildID as string)
        if (!guildPlayer) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              description: '⛔ | There no music playing in this guild.'
            })]
          })
          return
        }

        if (!this.client.utils.passedUserRequirements(msg, guildPlayer)) return

        guildPlayer.destroy()

        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            description: '☠️ | Ended the music player!'
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
        description: 'Stop playing music.'
      })
  }
  public category = 'Music'
}