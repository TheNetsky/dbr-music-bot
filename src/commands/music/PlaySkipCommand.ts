import { Command } from 'eris'
import { Client } from 'src/base/Client'


export default class PlaySkipCommand extends Command {
  constructor(public client: Client) {
    super('playskip', async (msg, args) => {

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

        const musicTrack = await this.client.erela.search(query, msg.author)
        if (musicTrack.loadType === 'NO_MATCHES') {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              description: '⛔ | No result found.'
            })]
          })
          return
        }

        if (musicTrack.loadType === 'LOAD_FAILED') {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              description: '⛔ | An error occured when loading the track.'
            })]
          })
          return
        }

        const guildPlayer = this.client.erela.players.get(msg.guildID as string)
        if (!msg.member?.voiceState.channelID) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              description: '⛔ | you must join voice channel to do this.'
            })]
          })
          return
        }

        // If no play exists
        if (!guildPlayer) {
          const player = await this.client.erela.create({
            guild: msg.guildID as string,
            voiceChannel: msg.member.voiceState.channelID as string,
            textChannel: msg.channel.id,
            selfDeafen: true
          })

          player.connect()

          if (musicTrack.loadType === 'PLAYLIST_LOADED') {
            for (const track of musicTrack.tracks) {
              player.queue.add(track)
            }

            msg.channel.createMessage({
              embeds: [this.client.utils.CreateEmbed({
                description: `☑ | Added Playlist ${musicTrack.playlist?.name} [${msg.author}] [\`${musicTrack.tracks.length} tracks\`]`
              })]
            })
          } else {
            player.queue.add(musicTrack.tracks[0])

            msg.channel.createMessage({
              embeds: [this.client.utils.CreateEmbed({
                description: `☑ | Added track \`${musicTrack.tracks[0].title}\` [${msg.author}]`
              })]
            })
          }
          player.play()
          return
        }

        // If player already exists
        if (msg.member.voiceState.channelID !== guildPlayer.voiceChannel) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              description: '⛔ | you must join voice channel same as me to do this.'
            })]
          })
          return
        }

        if (musicTrack.loadType === 'PLAYLIST_LOADED') {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              description: '⛔ | you can only playskip with a single track.'
            })]
          })
          return
        }

        guildPlayer.queue.unshift(musicTrack.tracks[0])
        guildPlayer.stop()

        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            description: `☑ | Playskipped track \`${guildPlayer.queue.current?.title}\``
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
        aliases: ['ps'],
        description: 'Skip and play current song.'
      })
  }
  public category = 'Music'
}