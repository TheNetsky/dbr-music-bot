import { Client } from '../../base/Client'
import { Event } from 'structures/Event'
import { Node } from 'erela.js'


export default class nodeErrorEvent extends Event {
  constructor(client: Client) {
    super(client, 'nodeError', true)
  }

  async execute(client: Client, node: Node, error: Error) {
    client.logger.warn(`NODE [${node.options.identifier}] ERROR`, error)
  }
}