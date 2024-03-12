import { Node } from 'shoukaku'

import { Client } from '../../structures/Client'
import { Event } from '../../structures/Event'


export default class nodeDestroyEvent extends Event {
  constructor(client: Client) {
    super(client, 'nodeDestroy', true)
  }

  async execute(client: Client, node: Node) {
    client.logger.warn(`${node.name}`, 'DESTROYED')
  }
}