import { Command } from 'eris'

import { Client } from '../../structures/Client'


export default class PlayCommand extends Command {
  constructor(public client: Client) {
    super('play', async (msg, args) => {

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
            }, 'YELLOW')]
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

        const guildPlayer = this.client.kazagumo.players.get(msg.guildID as string)
        // If no guildPlayer exists, create one
        if (!guildPlayer) {
          const player = await this.client.kazagumo.createPlayer({
            guildId: msg.guildID as string,
            voiceId: msg.member?.voiceState.channelID as string,
            textId: msg.channel.id,
            deaf: true
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
            }, 'YELLOW')]
          })
          return
        }

        // Load playlist
        if (musicTrack.type === 'PLAYLIST') {
          for (const track of musicTrack.tracks) {
            guildPlayer.queue.add(track)
          }

          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: `✅ | Added Playlist ${musicTrack.playlistName} [<@${msg.author.id}>] [\`${musicTrack.tracks.length} tracks\`]`
            }, 'YELLOW')]
          })

        } else {
          // Load single track
          guildPlayer.queue.add(musicTrack.tracks[0])

          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: `✅ | Added track \`${musicTrack.tracks[0].title}\` [<@${msg.author.id}>]`
            })]
          })
        }

        // Only start playing if not already playing
        if (!guildPlayer.playing) {
          guildPlayer.play()
        }
        return

      } catch (e) {
        this.client.logger.error('CMD', e)
        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: '⛔ | An error occured.'
          }, 'RED')]
        })
        return
      }
    },
      {
        aliases: ['p'],
        description: 'Play some music.',
        usage: 'play {YouTube URL, Spotify URL or search query}',
        argsRequired: true
      })
  }
  public category = 'Music'
}