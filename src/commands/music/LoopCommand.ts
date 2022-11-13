import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class LoopCommand extends Command {
  constructor(public client: Client) {
    super('loop', async (msg) => {

      try {
        const guildPlayer = this.client.erela.players.get(msg.guildID ?? '')
        if (!guildPlayer) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              description: '⛔ | There no music playing in this guild.'
            })]
          })
          return
        }

        if (!this.client.utils.passedUserRequirements(msg, guildPlayer)) return

        guildPlayer.setTrackRepeat(!guildPlayer.trackRepeat)

        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            description: `👌 | ${guildPlayer.queueRepeat ? 'Enabled loop 🔂' : 'Disabled loop'}`
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
        description: 'Loop current track.'
      })
  }
  public category = 'Music'
}