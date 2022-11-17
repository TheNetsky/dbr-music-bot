import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class SetDJOnlyCommand extends Command {
  constructor(public client: Client) {
    super('setdjonly', async (msg) => {

      try {
        const guildData = await this.client.utils.getGuildData(msg.guildID as string) ?? { DJRoleOnly: false }

        if (!guildData.DJRole) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | No DJ role found!\n You need to set the DJ role first, do this using the \`setdjrole\` command.'
            })]
          })
          return
        }

        const newData = await this.client.utils.setGuildData(msg.guildID as string, { DJRoleOnly: !guildData.DJRoleOnly })

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: `✅ | The DJ role has been ${newData.DJRoleOnly ? '\`Enabled\`' : '\`Disabled\`'}`
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
        description: 'Set music commands to DJ role only.',
        usage: 'setdjonly',
        argsRequired: false
      })
  }
  public category = 'Config'
}