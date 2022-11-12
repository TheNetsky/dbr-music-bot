const { Listener } = require('discord-akairo')

module.exports = class interactionCreate extends Listener {
  constructor() {
    super('interactionCreate', {
      event: 'interactionCreate',
      emitter: 'client',
    })
  }

  /**
   *
   * @param {import('discord.js').Interaction} interaction
   */
  async exec(interaction) {
    if (!interaction.isCommand()) return
    if (!interaction.deferred) await interaction.deferReply()

    const command = this.client.commandHandler.modules.get(interaction.commandName)
    if (!command || !command.executeSlash) {
      return interaction.editReply({ embeds: [this.client.utils.CreateEmbed().setDescription(`❌ command ${interaction.commandName} does not exist`)] })
    }
    
    await command.executeSlash(interaction)
  }
}
