import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class SetDJRoleCommand extends Command {
  constructor(public client: Client) {
    super('setdjrole', async (msg, args) => {

      try {

        const roleArg = args[0]

        const roleRegex = roleArg.match(/<@&(\d+)>/)

        if (roleRegex && roleRegex[1]) {
          await this.client.utils.setGuildData(msg.guildID as string, { DJRole: roleRegex[1] })

          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: `✅ | The DJ role has been to <@&${roleRegex[1]}>`
            })]
          })
          return

        } else {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | Invalid or no role provided.'
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
        description: 'Set the DJ role.',
        usage: 'setdjrole {role}',
        argsRequired: true
      })
  }
  public category = 'Config'
}