import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class PreviousCommand extends Command {
  constructor(public client: Client) {
    super('previous', async (msg) => {

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

        if (!guildPlayer.queue.previous) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              color: 'YELLOW',
              description: '⛔ | The is no previous track.'
            })]
          })
          return
        }

        guildPlayer.queue.add(guildPlayer.queue.previous)
        guildPlayer.queue.unshift(guildPlayer.queue.previous)
        guildPlayer.stop()

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: '⏮ | Playing previous track.'
          })]
        })
        return

      } catch (e) {
        this.client.logger.error('CMD', e)
        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            color: 'YELLOW',
            description: '⛔ | An error occured.'
          })]
        })
        return
      }
    },
      {
        aliases: ['prev'],
        description: 'Play the previous track.',
        usage: 'previous'
      })
  }
  public category = 'Music'
}