import { Command } from 'eris'

import { Client } from 'structures/Client'


export default class StopCommand extends Command {
  constructor(public client: Client) {
    super('stop', async (msg) => {

      try {
        const guildPlayer = this.client.kazagumo.players.get(msg.guildID as string)
        if (!guildPlayer) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | There no music playing in this guild.'
            })]
          })
          return
        }

        if (!this.client.utils.passedUserRequirements(msg, guildPlayer)) return

        guildPlayer.destroy()

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: '☠️ | Ended the music player!'
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
        aliases: ['leave'],
        description: 'Stop playing music.',
        usage: 'stop'
      })
  }
  public category = 'Music'
}