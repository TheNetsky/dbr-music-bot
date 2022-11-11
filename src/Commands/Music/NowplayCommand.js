const { Command } = require('discord-akairo');

module.exports = class NowPlayCommand extends Command {
  constructor() {
    super('nowplay', {
      aliases: ['nowplay', 'np'],
      description: {
        content: 'Get the current playing',
      },
      category: 'Music',
      cooldown: 3000,
    });
  }

  async exec(msg) {
    try {
      const GuildPlayers = this.client.erela.players.get(msg.guild.id);
      if (!GuildPlayers) {
        return msg.channel.send({ embeds: [this.client.utils.CreateEmbed().setDescription('⛔ | There no music playing in this guild')] });
      }

      return msg.channel.send({
        embeds: [
          this.client.utils.CreateEmbed()
            .setAuthor({
              name: 'Currently Being Played',
              value: `${GuildPlayers.queue.current.uri}`
            })
            .setTitle(`${GuildPlayers.trackRepeat ? '🔂' : GuildPlayers.paused ? '⏸' : '▶️'} | ${GuildPlayers.queue.current.title}`)
            .setURL(`${GuildPlayers.queue.current.uri}`)
            .setThumbnail(`${GuildPlayers.queue.current.thumbnail}`)
            .setDescription(`\`Length:\` ${this.client.utils.getDurationString(GuildPlayers.queue.current.duration)}\n\n\`Requested by\`: ${GuildPlayers.queue.current.requester}`)
            .setFields([
              {
                name: 'Next Up',
                value: `${GuildPlayers.queue.length == 0 ? '\`Nothing\`' : `\`${GuildPlayers.queue[0].title}\``}`
              }])
        ]
      });
    } catch (e) {
      this.client.logger.error(e.message);
      return msg.channel.send({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | An error occured')] });
    }
  }
};
