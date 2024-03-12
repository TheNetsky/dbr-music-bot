import { Command } from 'eris'

import { Client } from 'structures/Client'


export default class PlaySkipCommand extends Command {
  constructor(public client: Client) {
    super('playskip', async (msg, args) => {

      try {
        const node = await this.client.kazagumo.getLeastUsedNode()
        if (!node || !node.sessionId) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | No nodes are currently connected.'
            }, 'YELLOW')]
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

        const queryArg = args.join(' ')

        const musicTrack = await this.client.kazagumo.search(queryArg, { requester: msg.author })

        if (musicTrack.type === 'SEARCH') {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | No result found.'
            }, 'YELLOW')]
          })
          return
        }

        // If no play exists
        const guildPlayer = this.client.kazagumo.players.get(msg.guildID as string)
        if (!guildPlayer) {
          const player = await this.client.kazagumo.createPlayer({
            guildId: msg.guildID as string,
            voiceId: msg.member.voiceState.channelID as string,
            textId: msg.channel.id,
            data: true
          })

          // Load playlist
          if (musicTrack.type === 'PLAYLIST') {
            for (const track of musicTrack.tracks) {
              player.queue.add(track)
            }

            msg.channel.createMessage({
              embeds: [this.client.utils.createEmbed({
                description: `✅ | Added Playlist ${musicTrack.playlistName} [<@${msg.author.id}>] [\`${musicTrack.tracks.length} tracks\`]`
              })]
            })

          } else {
            // Load single track
            player.queue.add(musicTrack.tracks[0])

            msg.channel.createMessage({
              embeds: [this.client.utils.createEmbed({
                description: `✅ | Added track \`${musicTrack.tracks[0].title}\` [<@${msg.author.id}>]`
              })]
            })
          }
          player.play()
          return
        }

        // If player already exists
        if (msg.member.voiceState.channelID !== guildPlayer.voiceId) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | you must join voice channel same as me to do this.'
            })]
          })
          return
        }

        // If playlist
        if (musicTrack.type === 'PLAYLIST') {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | you can only playskip with a single track.'
            })]
          })
          return
        }

        // If no queue
        if (guildPlayer.queue.length == 0) {
          guildPlayer.queue.add(musicTrack.tracks[0])

          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: `✅ | Added track \`${musicTrack.tracks[0].title}\` [<@${msg.author.id}>]`
            })]
          })

          guildPlayer.play()
          return
        }

        // If query is a number
        if (!isNaN(Number(queryArg))) {
          const trackNumber = Number(queryArg)

          if (trackNumber > guildPlayer.queue.size || trackNumber < 1) {
            msg.channel.createMessage({
              embeds: [this.client.utils.createEmbed({
                description: '⛔ | There\'s no track with this queue position.\nUse the `queue` command to see the current queue.'
              })]
            })
            return
          }

          guildPlayer.shoukaku.stopTrack()
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: `⏭ | Playskipped track \`${guildPlayer.queue.current?.title}\``
            })]
          })
          return
        }

        // Play single track
        guildPlayer.queue.unshift(musicTrack.tracks[0])
        guildPlayer.shoukaku.stopTrack()

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
            description: '⛔ | An error occured'
          }, 'RED')]
        })
        return
      }
    },
      {
        aliases: ['ps'],
        description: 'Skip and play current track.',
        usage: 'playskip {YouTube URL, Spotify URL, search query or queue position}',
        argsRequired: true
      })
  }
  public category = 'Music'
}