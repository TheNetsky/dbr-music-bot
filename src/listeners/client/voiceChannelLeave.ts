import { Client } from 'structures/Client'
import { Event } from 'structures/Event'
import { Member, TextVoiceChannel } from 'eris'


export default class voiceChannelLeaveEvent extends Event {
  constructor(client: Client) {
    super(client, 'voiceChannelLeave', false)
  }

  async execute(client: Client, member: Member, channel: TextVoiceChannel) {

    if (channel.voiceMembers.filter((member) => !member.user.bot).length === 0) {
      const guildPlayer = client.erela.players.get(channel.guild.id)

      if (!guildPlayer) {
        if (channel.voiceMembers.find(x => x.id == client.user.id)) {
          channel.leave()
        }
        return
      }

      guildPlayer.destroy()
      client.logger.info('ALL USERS LEFT THE VOICE CHANNEL, PLAYER DESTOYED!')
    }

  }
}