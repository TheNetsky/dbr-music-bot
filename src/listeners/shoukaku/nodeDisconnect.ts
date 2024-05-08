import { Node } from 'shoukaku'

import { Client } from '../../structures/Client'
import { Event } from '../../structures/Event'


export default class nodeDisconnectEvent extends Event {
  constructor(client: Client) {
    super(client, 'disconnect', true)
  }

  async execute(client: Client, node: Node, code: number, reason: string) {
    client.logger.warn(`${node}`, `CLOSED CODE: ${code} REASON: ${reason}`)
  }
}