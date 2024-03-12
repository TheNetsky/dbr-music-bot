import { Client } from 'structures/Client'
import { Event } from 'structures/Event'


export default class ReadyEvent extends Event {
  constructor(client: Client) {
    super(client, 'ready', true)
  }

  async execute(client: Client) {
    client.logger.info('CLIENT','READY!')
    
    client.editStatus('online', { name: 'Buurman & Buurman, Back to back!', type: 2 })
  }
}