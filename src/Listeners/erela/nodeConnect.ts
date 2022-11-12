import { Client } from '../../base/Client'
import { Event } from 'structures/Event'
import { Node } from 'erela.js'


export default class nodeConnectEvent extends Event {
  constructor(client: Client) {
    super(client, 'nodeConnect', true)
  }

  async execute(client: Client, node: Node) {
    client.logger.info(`NODE [${node.options.identifier}] CONNECTED`)
  }
}