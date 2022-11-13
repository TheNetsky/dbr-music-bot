import { Client } from 'structures/Client'
import { Event } from 'structures/Event'
import { Node } from 'erela.js'


export default class nodeDisconnectEvent extends Event {
  constructor(client: Client) {
    super(client, 'nodeDisconnect', true)
  }

  async execute(client: Client, node: Node) {
    client.logger.warn(`NODE [${node.options.identifier}] DISCONNECTED`)
  }
}