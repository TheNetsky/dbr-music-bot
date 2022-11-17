import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class PlaySkipCommand extends Command {
  constructor(public client: Client) {
    super('playskip', async (msg, args) => {

      try {
        const node = this.client.erela.leastUsedNodes.first()
        if (!node || !node.connected) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              color: 'YELLOW',
              description: '⛔ | No nodes are currently connected.'
            })]
          })
          return
        }

        const queryArg = args[0]

        const musicTrack = await this.client.erela.search(queryArg, msg.author)
        if (musicTrack.loadType === 'NO_MATCHES') {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | No result found.'
            })]
          })
          return
        }

        if (musicTrack.loadType === 'LOAD_FAILED') {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | An error occured when loading the track.'
            })]
          })
          return
        }

        if (!msg.member?.voiceState.channelID) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | you must join voice channel to do this.'
            })]
          })
          return
        }

        // If no play exists
        const guildPlayer = this.client.erela.players.get(msg.guildID as string)
        if (!guildPlayer) {
          const player = await this.client.erela.create({
            guild: msg.guildID as string,
            voiceChannel: msg.member.voiceState.channelID as string,
            textChannel: msg.channel.id,
            selfDeafen: true
          })

          player.connect()

          // Load playlist
          if (musicTrack.loadType === 'PLAYLIST_LOADED') {
            for (const track of musicTrack.tracks) {
              player.queue.add(track)
            }

            msg.channel.createMessage({
              embeds: [this.client.utils.createEmbed({
                description: `✅ | Added Playlist ${musicTrack.playlist?.name} [${msg.author}] [\`${musicTrack.tracks.length} tracks\`]`
              })]
            })

          } else {
            // Load single track
            player.queue.add(musicTrack.tracks[0])

            msg.channel.createMessage({
              embeds: [this.client.utils.createEmbed({
                description: `✅ | Added track \`${musicTrack.tracks[0].title}\` [${msg.author}]`
              })]
            })
          }
          player.play()
          return
        }

        // If player already exists
        if (msg.member.voiceState.channelID !== guildPlayer.voiceChannel) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | you must join voice channel same as me to do this.'
            })]
          })
          return
        }

        // If playlist
        if (musicTrack.loadType === 'PLAYLIST_LOADED') {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | you can only playskip with a single track.'
            })]
          })
          return
        }

        // If query is a number
        if (!isNaN(Number(queryArg))) {
          const trackNumber = Number(queryArg)

          if (trackNumber > guildPlayer.queue.size || trackNumber < 1) {
            msg.channel.createMessage({
              embeds: [this.client.utils.createEmbed({
                description: '⛔ | There\'s no track with this queue position.\nUse the \`queue\` command to see the current queue.'
              })]
            })
            return
          }

          guildPlayer.stop(trackNumber)
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: `⏭ | Playskipped track \`${guildPlayer.queue.current?.title}\``
            })]
          })
          return
        }

        // Play single track
        guildPlayer.queue.unshift(musicTrack.tracks[0])
        guildPlayer.stop()

        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: `⏭ | Playskipped track \`${guildPlayer.queue.current?.title}\``
          })]
        })
        return

      } catch (e) {
        this.client.logger.error('CMD', e)
        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            color: 'RED',
            description: '⛔ | An error occured'
          })]
        })
        return
      }
    },
      {
        aliases: ['ps'],
        description: 'Skip and play current track.',
        usage: 'playskip {YouTube URL, Spotify URL, search query or queue position}',
        argsRequired:  true
      })
  }
  public category = 'Music'
}