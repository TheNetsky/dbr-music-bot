import { Node } from 'erela.js'
import { Client } from '../Base/Client'

export default class listener {
  constructor(public client: Client) { }
  public type = 'once';
  public emitter = 'erela';
  public event = 'nodeDestroy'
  
  public async run(node: Node) {
    this.client.logger.warn(`NODE [${node.options.identifier}] DESTROYED`)
  }
}