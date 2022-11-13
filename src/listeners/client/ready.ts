import { Client } from '../../base/Client'
import { Event } from 'structures/Event'


export default class ReadyEvent extends Event {
  constructor(client: Client) {
    super(client, 'ready', true)
  }

  async execute(client: Client) {
    client.logger.info(`CLIENT READY WITH ${client.guilds.size} GUILDS`)
    client.editStatus('online', { name: 'Buurman & Buurman, Back to back!', type: 2 })
    client.erela.init(client.user?.id)
  }
}