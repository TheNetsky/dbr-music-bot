import { Command } from 'eris'

import { Client } from '../../structures/Client'


export default class PreviousCommand extends Command {
  constructor(public client: Client) {
    super('previous', async (msg) => {

      try {
        const guildPlayer = this.client.kazagumo.players.get(msg.guildID as string)
        if (!guildPlayer) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | There no music playing in this guild.'
            }, 'YELLOW')]
          })
          return
        }

        if (!this.client.utils.passedUserRequirements(msg, guildPlayer)) return

        if (!guildPlayer.queue.previous) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | The is no previous track.'
            }, 'YELLOW')]
          })
          return
        }

        guildPlayer.queue.add(guildPlayer.getPrevious()![0])
        guildPlayer.queue.unshift(guildPlayer.getPrevious()![0])
        guildPlayer.shoukaku.stopTrack()

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: '⏮ | Playing previous track.'
          })]
        })
        return

      } catch (e) {
        this.client.logger.error('CMD', e)
        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: '⛔ | An error occured.'
          }, 'YELLOW')]
        })
        return
      }
    },
      {
        aliases: ['prev'],
        description: 'Play the previous track.',
        usage: 'previous'
      })
  }
  public category = 'Music'
}