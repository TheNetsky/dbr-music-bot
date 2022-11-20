import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class ToggleMusicChannelOnlyCommand extends Command {
  constructor(public client: Client) {
    super('togglemusicchannelonly', async (msg) => {

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
        aliases: ['setmusicchannelonly', 'musicchannelonly'],
        description: 'Toggle if music commands should be music channel only.',
        usage: 'ToggleMusicChannelOnly'
      })
  }
  public category = 'Config'
}