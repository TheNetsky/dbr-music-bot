import { Client } from 'structures/Client'
import { Event } from 'structures/Event'
import { Command, Message } from 'eris'


export default class messageCreateEvent extends Event {
  constructor(client: Client) {
    super(client, 'messageCreate', false)
  }

  async execute(client: Client, message: Message) {
    if (message.author.bot) return
    if (!message.command) return

    const command: Command = message.command
    const requirements: any = command.requirements

    // Requirement userIDs
    if (requirements.userIDs?.length) {
      if (!requirements.userIDs.includes(message.author.id)) {
        const msg = await message.channel.createMessage('You don\'t have permissions to use this command.')
        setTimeout(() => {
          msg.delete()
        }, 5000)
      }
    }

  }
}
