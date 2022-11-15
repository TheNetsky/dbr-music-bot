import { Command } from 'eris'
import { Client } from 'structures/Client'


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

        const queryArg = args[0]
        if (!queryArg) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: '⛔ | No arguments provided.'
            })]
          })
          return
        }

        const musicTrack = await this.client.erela.search(queryArg, msg.author)
        if (musicTrack.loadType === 'NO_MATCHES') {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: '⛔ | No result found.'
            })]
          })
          return
        }

        if (musicTrack.loadType === 'LOAD_FAILED') {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: '⛔ | An error occured when loading the track.'
            })]
          })
          return
        }

        if (!msg.member?.voiceState.channelID) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: '⛔ | you must join voice channel to do this.'
            })]
          })
          return
        }

        const guildPlayer = this.client.erela.players.get(msg.guildID as string)
        // If no guildPlayer exists, create one
        if (!guildPlayer) {
          const player = await this.client.erela.create({
            guild: msg.guildID as string,
            voiceChannel: msg.member?.voiceState.channelID as string,
            textChannel: msg.channel.id,
            selfDeafen: true,
          })

          player.connect()

          // Load playlist
          if (musicTrack.loadType === 'PLAYLIST_LOADED') {
            for (const track of musicTrack.tracks) {
              player.queue.add(track)
            }

            msg.channel.createMessage({
              embeds: [this.client.utils.CreateEmbed({
                description: `✅ | Added Playlist ${musicTrack.playlist?.name} [<@${msg.author.id}>] [\`${musicTrack.tracks.length} tracks\`]`
              })]
            })

          } else {
            // Load single track
            player.queue.add(musicTrack.tracks[0])

            msg.channel.createMessage({
              embeds: [this.client.utils.CreateEmbed({
                description: `✅ | Added track \`${musicTrack.tracks[0].title}\` [<@${msg.author.id}>]`
              })]
            })
          }
          return player.play()
        }

        // If player already exists
        if (msg.member.voiceState.channelID !== guildPlayer.voiceChannel) {
          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: '⛔ | you must join voice channel same as me to do this.'
            })]
          })
          return
        }

        // Load playlist
        if (musicTrack.loadType === 'PLAYLIST_LOADED') {
          for (const track of musicTrack.tracks) {
            guildPlayer.queue.add(track)
          }

          msg.channel.createMessage({
            embeds: [this.client.utils.CreateEmbed({
              color: 'YELLOW',
              description: `✅ | Added Playlist ${musicTrack.playlist?.name} [<@${msg.author.id}>] [\`${musicTrack.tracks.length} tracks\`]`
            })]
          })
          return
        }

        // Load single track
        guildPlayer.queue.add(musicTrack.tracks[0])

        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            color: 'YELLOW',
            description: `✅ | Added track \`${musicTrack.tracks[0].title}\` [<@${msg.author.id}>]`
          })]
        })
        return

      } catch (e) {
        this.client.logger.error(e.message)
        msg.channel.createMessage({
          embeds: [this.client.utils.CreateEmbed({
            color: 'RED',
            description: '⛔ | An error occured.'
          })]
        })
        return
      }
    },
      {
        aliases: ['p'],
        description: 'Play some music.'
      })
  }
  public category = 'Music'
}