const { Command } = require('discord-akairo')

module.exports = class PlaySkipCommand extends Command {
  constructor() {
    super('playskip', {
      aliases: ['playskip', 'ps'],
      description: {
        content: 'Skip and play current song.',
      },
      category: 'Music',
      cooldown: 3000,
      args: [
        {
          id: 'query',
          type: 'string',
          match: 'rest',
          prompt: {
            start: 'What music you want to play?',
          },
        },
      ],
    })
  }

  async exec(msg, { query }) {
    try {
      const node = this.client.erela.leastUsedNodes.first()
      if (!node || !node.connected) {
        return msg.channel.send({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | No nodes are currently connected.')] })
      }

      const MusicTracks = await this.client.erela.search(query, msg.author)
      if (MusicTracks.loadType === 'NO_MATCHES') {
        return msg.channel.send({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | No result found.')] })
      }

      if (MusicTracks.loadType === 'LOAD_FAILED') {
        return msg.channel.send({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | An error occured when loading the track.')] })
      }

      const GuildPlayers = this.client.erela.players.get(msg.guild.id)
      if (!msg.member.voice.channelId) {
        return msg.channel.send({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | you must join voice channel to do this.')] })
      }

      // If no play exists
      if (!GuildPlayers) {
        const player = await this.client.erela.create({
          guild: msg.guild.id,
          voiceChannel: msg.member.voice.channelId,
          textChannel: msg.channel.id,
          selfDeafen: true,
        })

        player.connect()

        if (MusicTracks.loadType === 'PLAYLIST_LOADED') {
          for (const track of MusicTracks.tracks) {
            player.queue.add(track)
          }
          msg.channel.send({ embeds: [this.client.utils.CreateEmbed().setDescription(`☑ | Added Playlist ${MusicTracks.playlist.name} [${msg.author}] [\`${MusicTracks.tracks.length} tracks\`]`)] })
        } else {
          player.queue.add(MusicTracks.tracks[0])
          msg.channel.send({ embeds: [this.client.utils.CreateEmbed().setDescription(`☑ | Added track \`${MusicTracks.tracks[0].title}\` [${msg.author}]`)] })
        }
        return player.play()
      }

      // If player already exists
      if (msg.member.voice.channelId !== GuildPlayers.voiceChannel) {
        return msg.channel.send({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | you must join voice channel same as me to do this.')] })
      }

      if (MusicTracks.loadType === 'PLAYLIST_LOADED') {
        return msg.channel.send({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | you can only playskip with a single track.')] })
      }

      await GuildPlayers.queue.unshift(MusicTracks.tracks[0])
      await GuildPlayers.stop()

      return msg.channel.send({ embeds: [this.client.utils.CreateEmbed().setDescription(`☑ | Playskipped track \`${GuildPlayers.queue.current.title}\``)] })
      
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
    const query = interaction.options.getString('query')
    if (!query) {
      interaction.editReply({ embeds: [this.client.utils.CreateEmbed().setDescription('⛔ | Input music name.')] })
    }

    const MusicTracks = await this.client.erela.search(query, interaction.user)
    if (MusicTracks.loadType === 'NO_MATCHES') {
      return interaction.editReply({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | No result found.')] })
    }

    if (MusicTracks.loadType === 'LOAD_FAILED') {
      return interaction.editReply({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | An error occured when loading the track.')] })
    }

    const GuildPlayers = this.client.erela.players.get(interaction.guild.id)
    if (!interaction.member.voice.channelId) {
      return interaction.editReply({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | you must join voice channel to do this.')] })
    }

    // If no play exists
    if (!GuildPlayers) {
      const player = await this.client.erela.create({
        guild: interaction.guild.id,
        voiceChannel: interaction.member.voice.channelId,
        textChannel: interaction.channel.id,
        selfDeafen: true,
      })

      player.connect()

      if (MusicTracks.loadType === 'PLAYLIST_LOADED') {
        for (const track of MusicTracks.tracks) {
          player.queue.add(track)
        }
        interaction.editReply({ embeds: [this.client.utils.CreateEmbed().setDescription(`☑ | Added Playlist ${MusicTracks.playlist.name} [${interaction.user}] [\`${MusicTracks.tracks.length} tracks\`]`)] })
      } else {
        player.queue.add(MusicTracks.tracks[0])
        interaction.editReply({ embeds: [this.client.utils.CreateEmbed().setDescription(`☑ | Added track \`${MusicTracks.tracks[0].title}\` [${interaction.user}]`)] })
      }
      return player.play()
    }

    // If player already exists
    if (interaction.member.voice.channelId !== GuildPlayers.voiceChannel) {
      return interaction.editReply({ embeds: [this.client.utils.CreateEmbed('YELLOW').setDescription('⛔ | you must join voice channel same as me to do this.')] })
    }

    if (MusicTracks.loadType === 'PLAYLIST_LOADED') {
      return interaction.editReply({ embeds: [this.client.utils.CreateEmbed().setDescription('⛔ | you can only playskip with a single track.')] })
    }

    await GuildPlayers.queue.unshift(MusicTracks.tracks[0])
    await GuildPlayers.stop()

    return interaction.editReply({ embeds: [this.client.utils.CreateEmbed().setDescription(`☑ | Playskipped track \`${GuildPlayers.queue.current.title}\``)] })
  }
}
