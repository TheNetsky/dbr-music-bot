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
          embeds: [this.client.utils.createEmbed({
            description: stripIndent`
            **System Statistics**
            \`\`\`ts
            Operating System: ${process.platform}
            Node.js: ${process.version}
            Version: ${version}
            Uptime: ${ms(this.client.uptime, { long: true })}
            Eris: ${Eris.VERSION}
            Memory Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB
            \`\`\`
            **Node Statistics**
            \`\`\`css
            Uptime: ${ms(this.client.erela.nodes.values().next().value.stats.uptime, { long: true })}
            Active Players: ${this.client.erela.nodes.values().next().value.stats.playingPlayers}
            Memory Allocated: ${Math.floor(this.client.erela.nodes.values().next().value.stats.memory.allocated / 1024 / 1024)}MB
            Memory Used: ${Math.floor(this.client.erela.nodes.values().next().value.stats.memory.used / 1024 / 1024)}MB
            CPU Load: ${Math.floor(this.client.erela.nodes.values().next().value.stats.cpu.lavalinkLoad)}%
            \`\`\`
            `
          })]
        })

      } catch (e) {
        this.client.logger.error('CMD', e)
        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
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
          userIDs: [client.config.devId]
        }
      })
  }
  public category = 'Utility'
}