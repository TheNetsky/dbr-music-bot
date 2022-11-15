import glob from 'glob'
import { resolveFile } from 'utils/HandlersUtil'
import { Client } from 'structures/Client'


export class CommandHandler {
  client: Client

  constructor(client: Client) {
    this.client = client
  }

  async loadCommands() {

    const files = process.env.BUILD_PATH
      ? glob.sync('./dist/src/commands/**/*.js')
      : glob.sync('./src/commands/**/*.ts')

    for (const file of files) {
      delete require.cache[file]

      const command = await resolveFile(file, this.client) as any
      const erisCommand = this.client.registerCommand(command.label, command.execute)

      for (const aliases of command.aliases) {
        this.client.registerCommandAlias(aliases, command.label)
      }

      Object.assign(erisCommand, command)

      if (erisCommand.usage) {
        erisCommand.invalidUsageMessage = {
          embeds: [this.client.utils.CreateEmbed({
            description: `⛔ | Invalid Usage/Arguments\nUsage: \`${erisCommand.usage}\``
          })]
        }
      }

      if (process.env['DEBUG_MODE'] === 'true') {
        this.client.logger.log(`COMMAND: Loaded ${command.label}`)
      }
    }
  }
}
