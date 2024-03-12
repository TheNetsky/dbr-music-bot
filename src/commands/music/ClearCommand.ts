
import { Command } from 'eris'

import { Client } from 'structures/Client'


export default class ClearCommand extends Command {
  constructor(public client: Client) {
    super('clear', async (msg) => {

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

        guildPlayer.queue.clear()

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: '💥 | Queue has been cleared!'
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
        aliases: ['clean', 'empty', 'nuke'],
        description: 'Clear the queue.',
        usage: 'clear'
      })
  }
  public category = 'Music'
}