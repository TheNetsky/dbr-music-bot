const { Listener } = require('discord-akairo');

module.exports = class Readylistener extends Listener {
  constructor() {
    super('voiceStateUpdate', {
      emitter: 'client',
      category: 'client',
      event: 'voiceStateUpdate',
    });
  }

  async exec(oldState) {
    if (!oldState?.channel) return;
    const channel = await this.client.channels.fetch(oldState.channel.id);

    if (channel.members.size - 1 <= 1) {
      const GuildPlayers = this.client.erela.players.get(oldState.guild.id);
      if (!GuildPlayers) return;
      
      GuildPlayers.destroy();
      this.client.logger.info('ALL USERS LEFT THE VOICE CHANNEL, PLAYER DESTOYED!');
    }
  }
};
