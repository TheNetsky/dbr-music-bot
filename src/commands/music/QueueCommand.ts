import { Command } from 'eris'
import { Client } from 'structures/Client'
import { Pagination } from 'utils/Pagination'


export default class QueueCommand extends Command {
  constructor(public client: Client) {
    super('queue', async (msg) => {

      try {
        const guildPlayer: any = this.client.erela.players.get(msg.guildID as string)
        if (!guildPlayer) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              description: '⛔ | There no music playing in this guild.'
            })]
          })
          return
        }

        if (guildPlayer.queue.size < 1) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              description: `Now Playing:\n\`\`\`css\n${guildPlayer?.queue.current?.title} | [${guildPlayer?.queue.current?.requester?.username}]\`\`\`\n\nNext Track:\n\`\`\`css\n${guildPlayer?.queue.values().next().value ? `${guildPlayer.queue.values().next().value.title} | [${guildPlayer.queue.values().next().value.requester.username}]` : 'Nothing'}\`\`\``
            })],
          })
          return
        }

        const chunks = this.client.utils.chunk(guildPlayer?.queue.map((x, i) => `\`${i + 1}\` ${x.title} [${x.requester.username}]`), 7)
        const guild = this.client.guilds.get(msg.guildID as string)

        const embeds: Array<any> = []

        let i = 1
        for (const chunk of chunks) {
          const embed = this.client.utils.CreateEmbed({
            description: chunk.join('\n'),
            author: {
              name: `${guild?.name}'s track queue`,
              icon_url: guild?.iconURL
            },
            footer: {
              text: `${i++}/${chunks.length}`,
            }
          })
          embeds.push(embed)
        }


        await new Pagination(this.client, msg, embeds).start()

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
        aliases: ['q'],
        description: 'Get current track queue.',
        usage: 'queue',
        cooldown: 10000
      })
  }
  public category = 'Music'
}