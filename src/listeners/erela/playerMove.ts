import { Client } from 'structures/Client'
import { Event } from 'structures/Event'
import { Player } from 'erela.js'
import { VoiceBasedChannelTypes } from 'discord.js'


export default class playerMoveEvent extends Event {
  constructor(client: Client) {
    super(client, 'playerMove', true)
  }

  async execute(client: Client, player: Player, oldChannel: VoiceBasedChannelTypes, newChannel: VoiceBasedChannelTypes) {
    client.logger.info(newChannel ? `PLAYER MOVED TO [${newChannel}]` : 'SOMEONE DISCONNECTED ME FROM VOICECHANNEL')

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