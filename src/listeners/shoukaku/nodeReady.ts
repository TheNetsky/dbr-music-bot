import { Node } from 'shoukaku'

import { Client } from '../../structures/Client'
import { Event } from '../../structures/Event'


export default class nodeReadyEvent extends Event {
  constructor(client: Client) {
    super(client, 'ready', true)
  }

  async execute(client: Client, node: Node) {
    client.logger.info(`${node}`, 'CONNECTED')
  }
}