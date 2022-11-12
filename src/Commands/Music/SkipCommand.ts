import { Command } from 'eris'
import { Client } from 'src/base/Client'


export default class SkipCommand extends Command {
  constructor(public client: Client) {
    super('skip', async (msg, args) => {

      try {
        const GuildPlayers = this.client.erela.players.get(msg.guildID ?? '')
        if (!GuildPlayers) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: '⛔ | There no music playing in this guild.'
            })]
          })
          return
        }

        if (!msg.member?.voiceState.channelID) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: '⛔ | you must join voice channel to do this.'
            })]
          })
          return
        }

        if (msg.member?.voiceState.channelID !== GuildPlayers.voiceChannel) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: '⛔ | you must join voice channel same as me to do this.'
            })]
          })
          return
        }

        GuildPlayers.stop()

        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            description: '👌 | Skipped current track.'
          })]
        })
        return

      } catch (e) {
        this.client.logger.error(e.message)
        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            color: 'YELLOW',
            description: '⛔ | An error occured.'
          })]
        })
        return
      }
    },
      {
        aliases: ['s'],
        description: 'Skip current playing track.',
        cooldown: 3000,
        argsRequired: false
      })
  }
  public category = 'Music'
}