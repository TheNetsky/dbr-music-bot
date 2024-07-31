import { Client } from '../../structures/Client'
import { Event } from '../../structures/Event'


export default class playerClosedEvent extends Event {
  constructor(client: Client) {
    super(client, 'playerDestroy', true)
  }

  async execute(client: Client) {
    client.editStatus('idle', { name: 'Buurman & Buurman, B2B!', type: 2 })
  }
}