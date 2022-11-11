const { Command } = require('discord-akairo');
const { CreateEmbed } = require('../../Utility/CreateEmbed');

module.exports = class BoundCommand extends Command {
  constructor() {
    super('shuffle', {
      aliases: ['shuffle'],
      description: {
        content: 'shuffle queue',
      },
      category: 'Music',
      cooldown: 3000,
    });
  }

  async exec(msg) {
    try {
      const GuildPlayers = this.client.erela.players.get(msg.guild.id);
      if (!GuildPlayers) {
        return msg.channel.send({ embeds: [CreateEmbed('info', '⛔ | There no music playing in this guild')] });
      }

      if (!msg.member.voice.channelId) {
        return msg.channel.send({ embeds: [CreateEmbed('warn', '⛔ | you must join voice channel to do this.')] });
      }

      if (msg.author.id !== GuildPlayers.queue?.current.requester.id) {
        return msg.channel.send({ embeds: [CreateEmbed('warn', '⛔ | Only requester can do this.')] });
      }
      await GuildPlayers.queue.shuffle();

      return msg.channel.send({ embeds: [CreateEmbed('info', '👌 | shuffled queue.')] });
    } catch (e) {
      this.client.logger.error(e.message);
      return msg.channel.send({ embeds: [CreateEmbed('warn', '⛔ | An error occured')] });
    }
  }
};
