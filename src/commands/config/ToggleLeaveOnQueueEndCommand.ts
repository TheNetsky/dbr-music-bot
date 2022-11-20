import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class LeaveOnQueueEndCommand extends Command {
  constructor(public client: Client) {
    super('leaveonqueueend', async (msg) => {

      try {
        const guildData = await this.client.utils.getGuildData(msg.guildID as string) ?? { leaveQueueEnd: true }

        const newData = await this.client.utils.setGuildData(msg.guildID as string, { leaveQueueEnd: !guildData.leaveQueueEnd })

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: `✅ | Leave on queue end has been ${newData.leaveQueueEnd ? '\`Enabled\`' : '\`Disabled\`'}`
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
        aliases: ['leaveonend', 'leaveonqend', 'leaveonempty'],
        description: 'Toggle if the bot should leave on queue end.',
        usage: 'ToggleLeaveOnQueueEnd'
      })
  }
  public category = 'Config'
}