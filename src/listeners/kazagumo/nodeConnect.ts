import { Node } from 'shoukaku'

import { Client } from '../../structures/Client'
import { Event } from '../../structures/Event'


export default class nodeConnectEvent extends Event {
  constructor(client: Client) {
    super(client, 'nodeConnect', true)
  }

  async execute(client: Client, node: Node) {
    client.logger.info(`${node.name}`, 'CONNECTED')
  }
}