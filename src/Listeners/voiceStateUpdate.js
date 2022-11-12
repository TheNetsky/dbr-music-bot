const { Listener } = require('discord-akairo')

module.exports = class Readylistener extends Listener {
  constructor() {
    super('voiceStateUpdate', {
      emitter: 'client',
      category: 'client',
      event: 'voiceStateUpdate',
    })
  }

  async exec(oldState, newState) {
    if (!oldState?.channel) return
    const channel = await this.client.channels.fetch(oldState.channel.id)

    if (channel.members.filter((member) => !member.user.bot).size === 0) {
      const GuildPlayers = this.client.erela.players.get(oldState.guild.id)

      if (!GuildPlayers) {
        if (channel.members.find(x => x.id == this.client.user.id)) {
          await channel.guild.me.voice.disconnect()
        }
        return
      }

      GuildPlayers.destroy()
      this.client.logger.info('ALL USERS LEFT THE VOICE CHANNEL, PLAYER DESTOYED!')
    }
  }
}
