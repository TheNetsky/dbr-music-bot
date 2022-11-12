import { Command } from 'eris';
import { Client } from 'src/base/Client';


export default class PlayCommand extends Command {
  constructor(public client: Client) {
    super('play', async (msg, args) => {

      try {
        const node = this.client.erela.leastUsedNodes.first()
        if (!node || !node.connected) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: '⛔ | No nodes are currently connected.'
            })]
          })
          return
        }

        const query = args[0]

        if (!query) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: '⛔ | No arguments provided.'
            })]
          })
          return
        }

        const MusicTracks = await this.client.erela.search(query, msg.author)
        if (MusicTracks.loadType === 'NO_MATCHES') {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: '⛔ | No result found.'
            })]
          })
          return
        }

        if (MusicTracks.loadType === 'LOAD_FAILED') {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: '⛔ | An error occured when loading the track.'
            })]
          })
          return
        }

        const GuildPlayers = this.client.erela.players.get(msg.guildID as string)
        if (!msg.member?.voiceState.channelID) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: '⛔ | you must join voice channel to do this.'
            })]
          })
          return
        }

        if (!GuildPlayers) {
          const player = await this.client.erela.create({
            guild: msg.guildID as string,
            voiceChannel: msg.member?.voiceState.channelID as string,
            textChannel: msg.channel.id,
            selfDeafen: true,
          })

          player.connect()

          if (MusicTracks.loadType === 'PLAYLIST_LOADED') {
            for (const track of MusicTracks.tracks) {
              player.queue.add(track)
            }

            msg.channel.createMessage({
              embeds: [this.client.utils.CreateEmbed({
                description: `☑ | Added Playlist ${MusicTracks.playlist?.name} [${msg.author}] [\`${MusicTracks.tracks.length} tracks\`]`
              })]
            })

          } else {
            player.queue.add(MusicTracks.tracks[0])

            msg.channel.createMessage({
              embeds: [this.client.utils.CreateEmbed({
                description: `☑ | Added track \`${MusicTracks.tracks[0].title}\` [${msg.author}]`
              })]
            })
          }
          return player.play()
        }

        if (msg.member.voiceState.channelID !== GuildPlayers.voiceChannel) {

          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: '⛔ | you must join voice channel same as me to do this.'
            })]
          })
          return
        }

        if (MusicTracks.loadType === 'PLAYLIST_LOADED') {
          for (const track of MusicTracks.tracks) {
            GuildPlayers.queue.add(track)
          }

          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: `☑ | Added Playlist ${MusicTracks.playlist?.name} [${msg.author}] [\`${MusicTracks.tracks.length} tracks\`]`
            })]
          })
          return
        }

        GuildPlayers.queue.add(MusicTracks.tracks[0])

        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            color: 'YELLOW',
            description: `☑ | Added track \`${MusicTracks.tracks[0].title}\` [${msg.author}]`
          })]
        })
        return

      } catch (e) {
        this.client.logger.error(e.message)
        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            color: 'RED',
            description: '⛔ | An error occured'
          })]
        })
        return
      }
    },
      {
        aliases: ['p'],
        description: 'Play some music.',
        cooldown: 3000,
        argsRequired: true
      })
  }
  public category = 'Music'
}