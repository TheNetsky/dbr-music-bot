const { Command } = require('discord-akairo');

module.exports = class SetDJCommand extends Command {
  constructor() {
    super('SetDJ', {
      description: {
        content: 'Set DJ role',
      },
      category: 'Config',
      cooldown: 3000,
      args: [
        {
          id: 'role',
          type: 'role',
          match: 'rest',
          prompt: {
            start: 'What could should be the DJ role?',
          },
        },
      ],
    });
  }

  async exec(msg, { role }) {
    try {
      // Todo

    } catch (e) {
      this.client.logger.error(e.message);
      return msg.channel.send({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | An error occured')] });
    }
  }
};
