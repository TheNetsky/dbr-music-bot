import { Client } from '../../Base/Client'

export default class listener {
  constructor(public client: Client) { }
  public type = 'once';
  public emitter = 'client'
  public event = 'ready'

  public run() {
    this.client.logger.info(`CLIENT READY WITH ${this.client.guilds.size} GUILDS`)
    this.client.editStatus('online', { name: 'Buurman & Buurman, Back to back!', type: 2 })
    this.client.erela.init(this.client.user?.id)
  }
}
