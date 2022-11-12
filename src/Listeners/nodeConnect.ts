import { Node } from 'erela.js'
import { Client } from '../Base/Client'

export default class listener {
  constructor(public client: Client) { }
  public type = 'once';
  public emitter = 'erela';
  public event = 'nodeConnect'

  public async run(node: Node) {
    this.client.logger.info(`NODE [${node.options.identifier}] CONNECTED`)
  }
}