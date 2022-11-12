import { Client } from '../../Base/Client'

export default class listener {
  constructor(public client: Client) { }
  public type = 'on';
  public emitter = 'client'
  public event = 'voiceStateUpdate'

  public async run(x) {
    console.log(x)
    /*
       const channel = await this.client.getChannel(member.channel_id) as VoiceChannel
    if (!channel) return

    if (channel.voiceMembers.filter((member) => !member.user.bot).length === 0) {
      const GuildPlayers = this.client.erela.players.get(oldState.guild.id)

      if (!GuildPlayers) {
        if (channel.voiceMembers.find(x => x.id == this.client.user.id)) {
          await channel.leave()
        }
        return
      }

      GuildPlayers.destroy()
      this.client.logger.info('ALL USERS LEFT THE VOICE CHANNEL, PLAYER DESTOYED!')
      */
    //}
  }
}
