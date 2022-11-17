import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class SetMusicChannelOnly extends Command {
  constructor(public client: Client) {
    super('setmusicchannelonly', async (msg) => {

      try {
        const guildData = await this.client.utils.getGuildData(msg.guildID as string) ?? { musicChannelOnly: false }

        if (!guildData.musicChannel) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | No music channel found!\n You need to set the music channel first, do this using the \`setmusicchannel\` command.'
            })]
          })
          return
        }

        const newData = await this.client.utils.setGuildData(msg.guildID as string, { musicChannelOnly: !guildData.musicChannelOnly })

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: `✅ | The music channel only has been ${newData.musicChannelOnly ? '\`Enabled\`' : '\`Disabled\`'}`
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
        description: 'Set music commands to the music channel only.',
        usage: 'setmusicchannelonly',
        argsRequired: false
      })
  }
  public category = 'Config'
}