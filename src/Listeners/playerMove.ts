import { VoiceBasedChannelTypes } from 'discord.js'
import { Player } from 'erela.js'
import { Client } from '../Base/Client'

export default class listener {
  constructor(public client: Client) { }
  public type = 'once';
  public emitter = 'erela';
  public event = 'playerMove'

  public async run(player: Player, oldChannel: VoiceBasedChannelTypes, newChannel: VoiceBasedChannelTypes) {
    this.client.logger.info(newChannel ? `PLAYER MOVED TO [${newChannel}]` : 'SOMEONE DISCONNECTED ME FROM VOICECHANNEL')

    try {
      player.setVoiceChannel(newChannel ?? player.voiceChannel)
    } catch (e) {
      player.destroy()
    }
    
    player.voiceChannel = newChannel
    setTimeout(() => player.pause(false), 3000)
    return undefined
  }
}