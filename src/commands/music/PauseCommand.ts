import { Command } from 'eris'

import { Client } from '../../structures/Client'


export default class PauseCommand extends Command {
  constructor(public client: Client) {
    super('pause', async (msg) => {

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
            description: '⛔ | An error occured.'
          }, 'RED')]
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