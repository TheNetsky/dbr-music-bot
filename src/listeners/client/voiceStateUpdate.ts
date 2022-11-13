import { Client } from 'structures/Client'
import { Event } from 'structures/Event'
import { VoiceChannel } from 'eris'


export default class voiceStateUpdateEvent extends Event {
  constructor(client: Client) {
    super(client, 'voiceStateUpdate', false)
  }

  async execute(client: Client, oldState) {

    if (!oldState?.channel) return
    const channel = await client.getChannel(oldState.channel.id) as VoiceChannel

    if (channel.voiceMembers.filter((member) => !member.user.bot).length === 0) {
      const guildPlayers = client.erela.players.get(oldState.guild.id)

      if (!guildPlayers) {
        if (channel.voiceMembers.find(x => x.id == client.user.id)) {
          channel.leave()
        }
        return
      }

      guildPlayers.destroy()
      client.logger.info('ALL USERS LEFT THE VOICE CHANNEL, PLAYER DESTOYED!')
    }

  }
}