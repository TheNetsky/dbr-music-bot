import { Command } from 'eris'

import { Client } from 'structures/Client'


export default class LoopQueue extends Command {
  constructor(public client: Client) {
    super('loopqueue', async (msg) => {

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

        guildPlayer.setLoop(guildPlayer.loop === 'none' ? 'queue' : 'none')

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: `${guildPlayer.loop === 'queue' ? '🔁 | Enabled queue loop' : '▶️ | Disabled queue loop'}`
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
        aliases: ['loopq'],
        description: 'Loop the entire queue.',
        usage: 'loop'
      })
  }
  public category = 'Music'
}