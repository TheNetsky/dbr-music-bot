import glob from 'glob'
import { Client } from '../structures/Client'
import { Event } from '../structures/Event'
import { resolveFile, validateFile } from '../utils/HandlersUtil'

export class EventHandler {
  client: Client

  constructor(client: Client) {
    this.client = client
  }

  async loadEvents() {

    const files = process.env.DEV_MODE === 'false'
      ? glob.sync('./compiled/src/listeners/**/*.js')
      : glob.sync('./src/listeners/**/*.ts')

    for (const file of files) {
      delete require.cache[file]

      const event = await resolveFile<Event>(file, this.client)
      if (!event) continue
      await validateFile(file, event)

      const isShoukaku = file.includes('shoukaku')
      const isKazagumo = file.includes('kazagumo')

      if (!event.execute) {
        throw new TypeError(`[ERROR][events]: execute function is required for events! (${file})`)
      }

      // Shoukaku Events
      if (isShoukaku) {
        if (event.once) {
          this.client.kazagumo.shoukaku.once(event.name as any, event.execute.bind(null, this.client))
        } else {
          this.client.kazagumo.shoukaku.on(event.name as any, event.execute.bind(null, this.client))
        }
        // Kazagumo Events
      } else if (isKazagumo) {
        if (event.once) {
          this.client.kazagumo.once(event.name as any, event.execute.bind(null, this.client))
        } else {
          this.client.kazagumo.on(event.name as any, event.execute.bind(null, this.client))
        }
        // Discord.js Events
      } else if (event.once) {
        this.client.once(event.name, event.execute.bind(null, this.client))
      } else {
        this.client.on(event.name, event.execute.bind(null, this.client))
      }

      if (process.env['DEV_MODE'] === 'true') {
        this.client.logger.info('EVENT', `Loaded ${event.name}`)
      }
    }
  }
}
