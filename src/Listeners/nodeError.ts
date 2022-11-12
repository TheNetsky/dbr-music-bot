import { Node } from 'erela.js'
import { Client } from '../Base/Client'

export default class listener {
  constructor(public client: Client) { }
  public type = 'once';
  public emitter = 'erela';
  public event = 'nodeError'

  public async run(node: Node, error: Error) {
    this.client.logger.warn(`NODE [${node.options.identifier}] ERROR`, error)
  }
}