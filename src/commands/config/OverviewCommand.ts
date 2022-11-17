import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class OverviewCommandCommand extends Command {
  constructor(public client: Client) {
    super('overview', async (msg) => {

      try {

        const guildData = await this.client.utils.getGuildData(msg.guildID as string)

        if (!guildData) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | No guild data found!\nLikely because you haven\'t changed/set any settings.'
            })]
          })
          return
        }

        const guild = this.client.guilds.get(msg.guildID as string)

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            author: {
              name: `${guild?.name}'s Settings Overview`,
              icon_url: guild?.iconURL
            },
            fields: [
              {
                name: 'DJ Role',
                value: `**Role:** ${guildData.DJRole ? `<@&${guildData.DJRole}>` : '\`None\`'}\n**DJ Only:** ${guildData.DJRoleOnly ? '\`Enabled\`' : '\`Disabled\`'}`
              },
              {
                name: 'Music Channel',
                value: `**Channel:** ${guildData.musicChannel ? `<#${guildData.musicChannel}>` : '\`None\`'}\n**Music Channel Only:** ${guildData.musicChannelOnly ? '\`Enabled\`' : '\`Disabled\`'}`
              }
            ]
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
        description: 'See an overview of your settings.',
        usage: 'overview'
      })
  }
  public category = 'Config'
}