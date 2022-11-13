import glob from 'glob'
import { Client } from 'structures/Client'
import { Event } from 'structures/Event'
import { resolveFile, validateFile } from 'utils/HandlersUtil'

export class EventHandler {
  client: Client

  constructor(client: Client) {
    this.client = client
  }

  async loadEvents() {

    const files = process.env.BUILD_PATH
      ? glob.sync('./dist/src/listeners/**/*.js')
      : glob.sync('./src/listeners/**/*.ts')

    for (const file of files) {
      delete require.cache[file]

      const event = await resolveFile<Event>(file, this.client)
      if (!event) continue
      await validateFile(file, event)

      const isErela = file.includes('erela')

      if (!event.execute) {
        throw new TypeError(`[ERROR][events]: execute function is required for events! (${file})`)
      }

      if (isErela) {
        this.client.erela.on(event.name as any, event.execute.bind(null, this.client))
      } else if (event.once) {
        this.client.once(event.name, event.execute.bind(null, this.client))
      } else {
        this.client.on(event.name, event.execute.bind(null, this.client))
      }

      if (process.env['DEBUG_MODE'] === 'true') {
        this.client.logger.log(`EVENT: Loaded ${event.name}`)
      }
    }
  }
}
