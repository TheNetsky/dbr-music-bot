/* eslint no-restricted-syntax: "off" */
const { Command } = require('discord-akairo');

module.exports = class PingCommand extends Command {
  constructor() {
    super('help', {
      aliases: ['help'],
      description: {
        content: 'Gets the bot\'s help command',
      },
      category: 'Util',
      cooldown: 3000,
      args: [
        {
          id: 'command',
          type: 'commandAlias',
        },
      ],
    });
  }

  async exec(msg, { command }) {
    try {
      if (!command) {
        const embed = this.client.utils.CreateEmbed()
          .addFields(`${this.client.user.username} command's`, `${this.client.config.prefix}help [command]`);

        for (const category of this.handler.categories.values()) {
          embed.addFields(String(category), `${category.filter((cmd) => cmd.aliases.length > 0).map((cmd) => `\`${cmd.aliases[0]}\``).join(', ')}`);
        }
        return msg.channel.send({ embeds: [embed] });
      }

      const embed = this.client.utils.CreateEmbed()
        .addFields('Description', `${command.description.content ? command.description.content : 'None'} ${command.description.ownerOnly ? '\n**[Owner Only]**' : '[Public Use]'}`)
        .addFields('Alias', command.aliases.length > 1 ? `\`${command.aliases.join('` `')}\`` : 'None.', true)
        .addFields('Examples', command.description.examples && command.description.examples.length ? `\`${command.aliases[0]} ${command.description.examples.join(`\`\n\`${command.aliases[0]} `)}\`` : 'None.');
      return msg.channel.send({ embeds: [embed] });
    } catch (e) {
      this.client.logger.error(e.message);
      return msg.channel.send({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | An error occured')] });
    }
  }
};
