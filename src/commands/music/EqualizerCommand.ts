import { Command } from 'eris'
import { Client } from 'structures/Client'


export default class EqualizerCommand extends Command {
  constructor(public client: Client) {
    super('equalizer', async (msg, args) => {

      try {

        const typeArg = args[0]?.toUpperCase()
        if (!typeArg) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              color: 'YELLOW',
              description: `⛔ | No arguments provided.\nOptions: \`RESET, CUSTOM, \`${[Presets.map(x => `\`${x.name}\``)]}\nIntensity: \`1-3\``
            })]
          })
          return
        }

        const guildPlayer: any = this.client.erela.players.get(msg.guildID as string)
        if (!guildPlayer) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '⛔ | There no music playing in this guild.'
            })]
          })
          return
        }

        if (!this.client.utils.passedUserRequirements(msg, guildPlayer)) return

        // Reset EQ
        if (typeArg == 'RESET') {
          guildPlayer.clearEQ()
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: '✅ | The equalizer has been reset.'
            })]
          })
          return
        }

        if (typeArg == 'CUSTOM') {

          const customArg = args.slice(1)
          if (!customArg || customArg.length == 0) {
            msg.channel.createMessage({
              embeds: [this.client.utils.createEmbed({
                description: '⛔ | No custom EQ object provided!'
              })]
            })
            return
          }

          try {
            const EQObject = JSON.parse(customArg.join(' '))

            msg.channel.createMessage({
              embeds: [this.client.utils.createEmbed({
                description: `✅ | Getting ready for custom EQ...\n\nThis can take a moment!`,
              })]
            })
            await guildPlayer.clearEQ()

            await new Promise(r => setTimeout(r, 5000))

            await guildPlayer.setEQ(EQObject)

            msg.channel.createMessage({
              embeds: [this.client.utils.createEmbed({
                description: `✅ | Equalizer set to custom values`,
                fields: [
                  {
                    name: 'Custom Value',
                    value: `\`\`\`${JSON.stringify(EQObject, null, 2)}\`\`\``
                  }
                ],
                footer: { text: 'Use "reset" to reset the equalizer.' }
              })]
            })

            return

          } catch (error) {
            msg.channel.createMessage({
              embeds: [this.client.utils.createEmbed({
                description: '⛔ | Custom EQ object error!',
                fields: [
                  {
                    name: 'Error',
                    value: `\`\`\`${JSON.stringify(error.message, null, 2)}\`\`\``
                  },
                  {
                    name: 'Template',
                    value: `\`\`\`${JSON.stringify([{ "band": 0, "gain": 0 }, { "band": 1, "gain": 0 }, { "band": 2, "gain": 0 }, { "band": 3, "gain": 0 }, { "band": 4, "gain": 0 }, { "band": 5, "gain": 0 }, { "band": 6, "gain": 0 }, { "band": 7, "gain": 0 }, { "band": 8, "gain": 0 }, { "band": 9, "gain": 0 }, { "band": 10, "gain": 0 }, { "band": 11, "gain": 0 }, { "band": 12, "gain": 0 }, { "band": 13, "gain": 0 }, { "band": 14, "gain": 0 }], null, 2)}\`\`\``
                  }
                ]
              })]
            })

            return
          }
        }

        // Else look for preset
        const preset = Presets.find(x => x.name == typeArg.toUpperCase())
        if (!preset) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: `⛔ | Unable to find that preset.\nOptions: ${[Presets.map(x => `\`${x.name}\``)]}`
            })]
          })
          return
        }

        const intensityArg = args[1]
        if (!intensityArg || isNaN(Number(intensityArg))) {
          msg.channel.createMessage({
            embeds: [this.client.utils.createEmbed({
              description: `⛔ | Missing intensity argument.\nIntensity: \`1-3\``
            })]
          })
          return
        }

        let intensity = Number(intensityArg)
        intensity = intensity > 3 ? 3 : intensity < 1 ? 1 : intensity

        guildPlayer.setEQ(preset.intensity[intensity])
        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            description: `✅ | The equalizer has been set to:\nPreset: \`${preset.name}\`\nIntensity: \`${intensity}\``,
            footer: { text: 'Use "reset" to reset the equalizer.' }
          })]
        })
        return

      } catch (e) {
        this.client.logger.error('CMD', e)
        msg.channel.createMessage({
          embeds: [this.client.utils.createEmbed({
            color: 'RED',
            description: '⛔ | An error occured.'
          })]
        })
        return
      }
    },
      {
        aliases: ['eq'],
        description: 'Change the player\'s equalizer.',
        usage: `equalizer {type} (RESET, CUSTOM, ${[Presets.map(x => `${x.name}`)]}) {intensity} (1-3)`,
        cooldown: 10000,
        argsRequired: true,
      })
  }
  public category = 'Music'
}

const Presets: Array<any> = [
  {
    name: 'BASSBOOST',
    intensity: {
      1: [
        {
          band: 0, gain: 0.0625
        },
        {
          band: 1, gain: 0.125
        },
        {
          band: 2, gain: -0.125
        },
        {
          band: 3, gain: -0.0625
        },
        {
          band: 4, gain: 0
        },
        {
          band: 5, gain: 0
        },
        {
          band: 6, gain: 0
        },
        {
          band: 7, gain: 0
        },
        {
          band: 8, gain: 0
        },
        {
          band: 9, gain: 0
        },
        {
          band: 10, gain: 0
        },
        {
          band: 11, gain: 0
        },
        {
          band: 12, gain: 0
        },
        {
          band: 13, gain: 0
        },
        {
          band: 14, gain: 0
        },
      ],
      2: [{
        band: 0, gain: 0.125
      },
      {
        band: 1, gain: 0.25
      },
      {
        band: 2, gain: -0.25
      },
      {
        band: 3, gain: -0.125
      },
      {
        band: 4, gain: 0
      },
      {
        band: 5, gain: -0.0125
      },
      {
        band: 6, gain: -0.025
      },
      {
        band: 7, gain: -0.0175
      },
      {
        band: 8, gain: 0
      },
      {
        band: 9, gain: 0
      },
      {
        band: 10, gain: 0
      },
      {
        band: 11, gain: 0
      },
      {
        band: 12, gain: 0
      },
      {
        band: 13, gain: 0
      },
      {
        band: 14, gain: 0
      },
      ],
      3: [{
        band: 0, gain: 0.1875
      },
      {
        band: 1, gain: 0.375
      },
      {
        band: 2, gain: -0.375
      },
      {
        band: 3, gain: -0.1875
      },
      {
        band: 4, gain: 0
      },
      {
        band: 5, gain: 0
      },
      {
        band: 6, gain: 0
      },
      {
        band: 7, gain: 0
      },
      {
        band: 8, gain: 0
      },
      {
        band: 9, gain: 0
      },
      {
        band: 10, gain: 0
      },
      {
        band: 11, gain: 0
      },
      {
        band: 12, gain: 0
      },
      {
        band: 13, gain: 0
      },
      {
        band: 14, gain: 0
      },
      ]
    }
  }
]
