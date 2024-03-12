import { Node } from 'shoukaku'

import { Client } from '../../structures/Client'
import { Event } from '../../structures/Event'


export default class nodeDisconnectEvent extends Event {
  constructor(client: Client) {
    super(client, 'nodeDisconnect', true)
  }

  async execute(client: Client, node: Node) {
    client.logger.warn(`${node.name}`, 'DISCONNECTED')
  }
}