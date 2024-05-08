import { Node } from 'shoukaku'

import { Client } from '../../structures/Client'
import { Event } from '../../structures/Event'


export default class nodeCloseEvent extends Event {
  constructor(client: Client) {
    super(client, 'close', true)
  }

  async execute(client: Client, node: Node) {
    client.logger.warn(`${node}`, 'DESTROYED')
  }
}