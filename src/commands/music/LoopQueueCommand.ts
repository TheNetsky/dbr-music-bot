import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class LoopQueue extends Command {
  constructor(public client: Client) {
    super('loopqueue', async (msg) => {

      try {
        const guildPlayer = this.client.erela.players.get(msg.guildID as string)
        if (!guildPlayer) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | There no music playing in this guild.'
            })]
          })
          return
        }

        if (!this.client.utils.passedUserRequirements(msg, guildPlayer)) return

        guildPlayer.setQueueRepeat(!guildPlayer.queueRepeat)

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: `${guildPlayer.trackRepeat ? '🔁 | Enabled queue loop' : '▶️ | Disabled queue loop'}`
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
        aliases: ['loopq'],
        description: 'Loop the entire queue.',
        usage: 'loop'
      })
  }
  public category = 'Music'
}