import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export class ResumeCommand extends Command {
  constructor() {
    super('resume', {
      aliases: ['resume', 'r'],
      description: {
        content: 'Resume current track',
      },
      category: 'Music',
      cooldown: 3000,
    })
  }

  async exec(msg) {
    try {
      const GuildPlayers = this.client.erela.players.get(msg.guild.id)
      if (!GuildPlayers) {
        return msg.channel.send({ embeds: [this.client.utils.CreateEmbed().setDescription('⛔ | There no music playing in this guild')] })
      }

      if (!msg.member.voice.channelId) {
        return msg.channel.send({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | you must join voice channel to do this.')] })
      }

      if (msg.member.voice.channelId !== GuildPlayers.voiceChannel) {
        return msg.channel.send({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | you must join voice channel same as me to do this.')] })
      }

      GuildPlayers.pause(false)
      return msg.channel.send({ embeds: [this.client.utils.CreateEmbed().setDescription('👌 | Resumed guild queue')] })

    } catch (e) {
      this.client.logger.error(e.message)
      return msg.channel.send({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | An error occured')] })
    }
  }

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async executeSlash(interaction) {
    try {
      const GuildPlayers = this.client.erela.players.get(interaction.guild.id)

      if (!GuildPlayers) {
        return interaction.editReply({ embeds: [this.client.utils.CreateEmbed().setDescription('⛔ | There no music playing in this guild')] })
      }

      if (!interaction.member.voice.channelId) {
        return interaction.editReply({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | you must join voice channel to do this.')] })
      }

      if (interaction.member.voice.channelId !== GuildPlayers.voiceChannel) {
        return interaction.editReply({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | you must join voice channel same as me to do this.')] })
      }

      GuildPlayers.pause(false)
      return interaction.editReply({ embeds: [this.client.utils.CreateEmbed().setDescription('👌 | Resumed guild queue')] })

    } catch (e) {
      this.client.logger.error(e.message)
      return interaction.editReply({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | An error occured')] })
    }
  }
}
