import { Command } from 'eris'

import { Client } from 'structures/Client'


export default class LoopCommand extends Command {
  constructor(public client: Client) {
    super('loop', async (msg) => {

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

        guildPlayer.setLoop(guildPlayer.loop === 'none' ? 'track' : 'none')

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: `${guildPlayer.loop === 'track' ? '🔂 | Enabled track loop' : '▶️ | Disabled track loop'}`
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
        description: 'Loop current track.',
        usage: 'loop'
      })
  }
  public category = 'Music'
}