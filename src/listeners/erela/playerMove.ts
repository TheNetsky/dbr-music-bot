import { Client } from 'structures/Client'
import { Event } from 'structures/Event'
import { Player } from 'erela.js'
import { VoiceChannel } from 'eris'


export default class playerMoveEvent extends Event {
  constructor(client: Client) {
    super(client, 'playerMove', true)
  }

  async execute(client: Client, player: Player, oldChannel: VoiceChannel, newChannel: VoiceChannel) {

    try {
      player.setVoiceChannel(newChannel.id ?? player.voiceChannel)
    } catch (e) {
      player.destroy()
    }

    player.voiceChannel = newChannel.id
    setTimeout(() => player.pause(false), 3000)
    return
  }
}