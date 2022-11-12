import { Client } from '../../base/Client'
import { Event } from 'structures/Event'
import { Node } from 'erela.js'


export default class nodeDestroyEvent extends Event {
  constructor(client: Client) {
    super(client, 'nodeDestroy', true)
  }

  async execute(client: Client, node: Node) {
    client.logger.warn(`NODE [${node.options.identifier}] DESTROYED`)
  }
}