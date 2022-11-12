const { Command } = require('discord-akairo')

module.exports = class LoopCommand extends Command {
  constructor() {
    super('loop', {
      aliases: ['loop'],
      description: {
        content: 'Loop track',
      },
      category: 'Music',
      cooldown: 3000,
    })
  }

  async exec(msg) {
    try {
      const GuildPlayers = this.client.erela.players.get(msg.guild.id)
      if (!GuildPlayers) return msg.channel.send({ embeds: [this.client.utils.CreateEmbed().setDescription('⛔ | There no music playing in this guild')] })

      if (!msg.member.voice.channelId) {
        return msg.channel.send({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | you must join voice channel to do this.')] })
      }

      if (msg.member.voice.channelId !== GuildPlayers.voiceChannel) {
        return msg.channel.send({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | you must join voice channel same as me to do this.')] })
      }

      GuildPlayers.setTrackRepeat(!GuildPlayers.trackRepeat)
      return msg.channel.send({ embeds: [this.client.utils.CreateEmbed().setDescription(`👌 | ${GuildPlayers.queueRepeat ? 'Enabled loop' : 'Disabled loop'}`)] })
      
    } catch (e) {
      this.client.logger.error(e.message)
      return msg.channel.send({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | An error occured')] })
    }
  }
}
