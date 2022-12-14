import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class PauseCommand extends Command {
  constructor(public client: Client) {
    super('pause', async (msg) => {

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

        guildPlayer.pause(true)

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: '✅ | Paused guild queue.'
          })]
        })
        return

      } catch (e) {
        this.client.logger.error('CMD', e)
        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            color: 'RED',
            description: '⛔ | An error occured.'
          })]
        })
        return
      }
    },
      {
        description: 'Pause current track.',
        usage: 'pause'
      })
  }
  public category = 'Music'
}