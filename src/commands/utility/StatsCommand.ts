import * as Eris from 'eris'
import { Client } from 'structures/Client'
import { version } from 'package.json'
import ms from 'ms'
import { stripIndent } from 'common-tags'


export default class StatsCommand extends Eris.Command {
  constructor(public client: Client) {
    super('stats', async (msg) => {

      try {
        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            description: stripIndent`
            **System Statistics**
            \`\`\`js
            Operating System: ${process.platform}
            Node.js: ${process.version}
            Version: ${version}
            Uptime: ${ms(this.client.uptime, { long: true })}
            Eris: ${Eris.VERSION}
            \`\`\`
            **Music Statistics**
            \`\`\`css
            Uptime: ${ms(this.client.erela.nodes.values().next().value.stats.uptime, { long: true })}
            Active Players: ${this.client.erela.nodes.values().next().value.stats.playingPlayers}
            \`\`\`
            `
          })]
        })
      } catch (e) {
        this.client.logger.error(e.message)
        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            color: 'RED',
            description: '⛔ | An error occured.'
          })]
        })
      }
    },
      {
        description: 'Gets the bot\'s statistics.',
        usage: 'stats',
        hidden: true,
        requirements: {
          userIDs: [client.config.owner]
        }
      })
  }
  public category = 'Utility'
}