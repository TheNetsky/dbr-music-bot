
import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class RemoveCommand extends Command {
  constructor(public client: Client) {
    super('remove', async (msg, args) => {

      try {

        let trackArg: any = args[0]
        if (!trackArg || isNaN(Number(trackArg))) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              color: 'YELLOW',
              description: '⛔ | No arguments provided.'
            })]
          })
          return
        }

        trackArg = Number(trackArg)

        const guildPlayer: any = this.client.erela.players.get(msg.guildID as string)
        if (!guildPlayer) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | There no music playing in this guild.'
            })]
          })
          return
        }

        if (!this.client.utils.passedUserRequirements(msg, guildPlayer)) return

        if (trackArg > guildPlayer.queue.size || trackArg < 1) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | There\'s no track with this queue position.\nUse the \`queue\` command to see the current queue.'
            })]
          })
          return
        }

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: `💀 | Removed track \`${guildPlayer.queue[trackArg - 1].title}\``
          })]
        })

        guildPlayer.queue.remove(trackArg - 1)
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
        description: 'Remove track from the queue.',
        usage: 'remove {queue position}',
        argsRequired: true
      })
  }
  public category = 'Music'
}