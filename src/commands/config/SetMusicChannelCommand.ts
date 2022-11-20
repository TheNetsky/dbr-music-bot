import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class SetMusicChannelCommand extends Command {
  constructor(public client: Client) {
    super('setmusicchannel', async (msg, args) => {

      try {

        const channelArg = args[0]

        const channelRegex = channelArg.match(/<#(\d+)>/)

        if (channelRegex && channelRegex[1]) {
          await this.client.utils.setGuildData(msg.guildID as string, { musicChannel: channelRegex[1] })

          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: `✅ | The music channel has been to <#${channelRegex[1]}>`
            })]
          })
          return

        } else {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | Invalid or no channel provided.'
            })]
          })
          return
        }

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
        aliases: ['musicchannel'],
        description: 'Set the music channel.',
        usage: 'SetMusicChannel {channel}',
        argsRequired: true
      })
  }
  public category = 'Config'
}