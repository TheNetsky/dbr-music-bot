import { Client } from '../../base/Client'
import { Event } from 'structures/Event'
import { VoiceChannel } from 'eris'


export default class voiceStateUpdateEvent extends Event {
  constructor(client: Client) {
    super(client, 'voiceStateUpdate', false)
  }

  async execute(client: Client, oldState, newState) {

    if (!oldState?.channel) return
    const channel = await client.getChannel(oldState.channel.id) as VoiceChannel

    if (channel.voiceMembers.filter((member) => !member.user.bot).length === 0) {
      const GuildPlayers = client.erela.players.get(oldState.guild.id)

      if (!GuildPlayers) {
        if (channel.voiceMembers.find(x => x.id == client.user.id)) {
          channel.leave()
        }
        return
      }

      GuildPlayers.destroy()
      client.logger.info('ALL USERS LEFT THE VOICE CHANNEL, PLAYER DESTOYED!')
    }

  }
}