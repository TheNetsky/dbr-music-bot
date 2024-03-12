import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class OverviewCommandCommand extends Command {
  constructor(public client: Client) {
    super('overview', async (msg) => {

      try {

        const guild = this.client.guilds.get(msg.guildID as string)

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            author: {
              name: `${guild?.name}'s Settings Overview`,
              icon_url: `${guild?.iconURL}`
            },
            fields: [
              {
                name: 'DJ Role',
                value: `**Role:** ${client.config.preferences.DJRole ? `<@&${client.config.preferences.DJRole}>` : '`None`'}\n**DJ Only:** ${client.config.preferences.DJRoleOnly ? '`Enabled`' : '`Disabled`'}`
              },
              {
                name: 'Music Channel',
                value: `**Channel:** ${client.config.preferences.musicChannel ? `<#${client.config.preferences.musicChannel}>` : '`None`'}\n**Music Channel Only:** ${client.config.preferences.musicChannelOnly ? '`Enabled`' : '`Disabled`'}`
              },
              {
                name: 'Other',
                value: `**Leave On Queue End:** ${client.config.preferences.leaveQueueEnd ? '`Enabled`' : '`Disabled`'}`
              }
            ]
          })]
        })
        return

      } catch (e) {
        this.client.logger.error('CMD', e)
        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: '⛔ | An error occured.'
          }, 'RED')]
        })
        return
      }
    },
      {
        aliases: ['ov'],
        description: 'See an overview of your settings.',
        usage: 'overview'
      })
  }
  public category = 'Config'
}