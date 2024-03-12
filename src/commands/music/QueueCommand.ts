import { Command } from 'eris'

import { Client } from '../../structures/Client'

import { Pagination } from '../../utils/Pagination'


export default class QueueCommand extends Command {
  constructor(public client: Client) {
    super('queue', async (msg) => {

      try {
        const guildPlayer = this.client.kazagumo.players.get(msg.guildID as string)
        if (!guildPlayer) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | There no music playing in this guild.'
            })]
          })
          return
        }

        if (guildPlayer.queue.size < 1) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              // @ts-expect-error Is valid
              description: `Now Playing:\n\`\`\`css\n${guildPlayer?.queue.current?.title} | [${guildPlayer?.queue.current?.requester.username}]\`\`\`\n\nNext Track:\n\`\`\`css\n${guildPlayer?.queue.values().next().value ? `${guildPlayer.queue.values().next().value.title} | [${guildPlayer.queue.values().next().value.requester.username}]` : 'Nothing'}\`\`\``
            })]
          })
          return
        }

        // @ts-expect-error Is valid
        const chunks: any[] = this.client.utils.chunk(guildPlayer?.queue.map((x, i) => `\`${i + 1}\` ${x.title} [${x.requester.username}]`), 7)
        const guild = this.client.guilds.get(msg.guildID as string)

        const embeds: Array<unknown> = []

        let i = 1
        for (const chunk of chunks) {
          const embed = this.client.utils.createEmbed({
            description: chunk.join('\n'),
            author: {
              name: `${guild?.name}'s track queue`
            },
            footer: {
              text: `${i++}/${chunks.length} | User !q {page} for the next page`
            }
          })
          embeds.push(embed)
        }


        await new Pagination(this.client, msg, embeds).start()

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
        aliases: ['q'],
        description: 'Get current track queue.',
        usage: 'queue',
        cooldown: 10000
      })
  }
  public category = 'Music'
}