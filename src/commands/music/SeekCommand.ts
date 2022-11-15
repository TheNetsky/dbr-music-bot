import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class SeekCommand extends Command {
  constructor(public client: Client) {
    super('seek', async (msg, args) => {

      try {

        const timeArg = args[0]
        if (!timeArg) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: '⛔ | No arguments provided.'
            })]
          })
          return
        }

        const guildPlayer: any = this.client.erela.players.get(msg.guildID as string)
        if (!guildPlayer) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              description: '⛔ | There no music playing in this guild.'
            })]
          })
          return
        }

        if (!this.client.utils.passedUserRequirements(msg, guildPlayer)) return

        if (!guildPlayer.queue.current?.isSeekable) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              description: '⛔ | Unable to seek through this track.'
            })]
          })
          return
        }

        const timeMS = Number(timeArg) * 1000

        if (isNaN(timeMS) || timeMS > guildPlayer.queue.current?.duration) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              description: '⛔ | You seek time is out of range of the track\' duration.'
            })]
          })
          return
        }

        guildPlayer.seek(timeMS)

        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            description: `✅ | Time skipped.`,
            fields: [
              {
                name: 'Progress',
                value: `\`${this.client.utils.getDurationString(timeMS)}\` ${this.client.utils.createSeekbar(timeMS, guildPlayer.queue.current.duration, 10).bar} \`${this.client.utils.getDurationString(guildPlayer.queue.current.duration)}\``
              }
            ]
          })]
        })
        return

      } catch (e) {
        this.client.logger.error(e.message)
        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            color: 'RED',
            description: '⛔ | An error occured.'
          })]
        })
        return
      }
    },
      {
        description: 'Seeks to a specified time in the track.'
      })
  }
  public category = 'Music'
}