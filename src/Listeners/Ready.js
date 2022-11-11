const { Listener } = require('discord-akairo');
const slashCommands = require('../Utility/SlashCommands');
const { logger } = require('../Utility/Logger');
const config = require('../config');

module.exports = class Readylistener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      category: 'client',
      event: 'ready',
    });
  }

  async exec() {
    this.client.logger.info(`CLIENT READY WITH ${this.client.guilds.cache.size} GUILDS`);
    this.client.user.setActivity('Buurman & Buurman, Back to back!', { type: 2 });
    this.client.erela.init(this.client.user.id);

    if (!config.updateSlash) return;
    for (const command of slashCommands) {
      this.client.application.commands.create(command.toJSON());
      logger.info(`CREATING ${command.name.toUpperCase()} SLASH COMMAND`);
    }
  }
};
