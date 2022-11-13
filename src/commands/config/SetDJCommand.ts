import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class SetDJCommand extends Command {
  constructor(public client: Client) {
    super('setdj', async (msg) => {

      try {

        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            description: 'Something!'
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
        description: 'Set the DJ role.'
      })
  }
  public category = 'Config'
}