const { Command } = require('discord-akairo')

module.exports = class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping'],
      description: {
        content: 'Gets the bot\'s heartbeat and latency',
      },
      category: 'Util',
      cooldown: 3000,
    })
  }

  async exec(msg) {
    try {
      const message = await msg.channel.send('Getting info...')
      
      const embed = this.client.utils.CreateEmbed()
        .addFields('⏳ Latency ', `__**${message.createdTimestamp - msg.createdTimestamp}ms**__`)
        .addFields('💓 API', `__**${Math.floor(this.client.ws.ping)}ms**__`)
        .setTimestamp()
      setTimeout(() => { message.edit({ content: null, embeds: [embed] }) }, 5000)
      
    } catch (e) {
      this.client.logger.error(e.message)
      return msg.channel.send({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | An error occured')] })
    }
  }
}
