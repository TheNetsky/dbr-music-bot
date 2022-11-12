import { Client } from '../../Base/Client'

export default class listener {
  constructor(public client: Client) { }
  public type = 'on';
  public emitter = 'client'
  public event = 'rawWS'

  public async run(packet) {
    this.client.erela.updateVoiceState(packet)
  }
}
