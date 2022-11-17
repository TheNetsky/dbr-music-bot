import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class ShuffleCommand extends Command {
  constructor(public client: Client) {
    super('shuffle', async (msg) => {

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

        await guildPlayer.queue.shuffle()

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: '🔀 | Shuffled the queue.'
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
        description: 'Shuffle the queue.',
        usage: 'shuffle'
      })
  }
  public category = 'Music'
}