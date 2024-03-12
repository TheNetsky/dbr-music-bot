import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { EmbedOptions, Message } from 'eris'
import { KazagumoPlayer } from 'kazagumo'

import { Client } from '../structures/Client'

dayjs.extend(duration)


export class Utils {
    client: Client
    constructor(client: Client) {
        this.client = client
    }

    createEmbed(embed: EmbedOptions, color?: string) {
        let colorValue: number
        switch (color?.toUpperCase()) {
            case 'YELLOW':
                colorValue = 16776960
                break
            case 'RED':
                colorValue = 15548997
                break
            default:
                colorValue = 9807270
        }

        return Object.assign(embed, { color: colorValue })
    }

    chunk(...args: any[]) {
        const [arr, len] = args
        const rest: Array<unknown> = []
        for (let i = 0; i < arr.length; i += len) {
            rest.push(arr.slice(i, i + len))
        }
        return rest
    }

    getDurationString(duration: number) {
        return dayjs.duration(duration)
            .format('HH:mm:ss')
    }

    createSeekbar(currentValue: number, maxValue: number, size: number, slider: string = '🔘', line: string = '▬') {
        if (currentValue > maxValue) {
            const bar = line.repeat(size + 2)
            const calculated = (currentValue / maxValue) * 100
            return { bar, calculated }
        } else {
            const percentage = currentValue / maxValue
            const progress = Math.round((size * percentage))
            const emptyProgress = size - progress
            const progressBar = line.repeat(progress).replace(/.$/, slider)
            const emptyprogressBar = line.repeat(emptyProgress)
            const bar = progressBar + emptyprogressBar
            const calculated = (currentValue / maxValue) * 100
            return { bar, calculated }
        }
    }

    passedUserRequirements(msg: Message, guildPlayer: KazagumoPlayer): boolean {
        if (!msg.member?.voiceState.channelID) {
            msg.channel.createMessage({
                embeds: [this.createEmbed({
                    description: '⛔ | you must join voice channel to do this.'
                })]
            })
            return false
        }

        if (msg.member?.voiceState.channelID !== guildPlayer.voiceId) {
            msg.channel.createMessage({
                embeds: [this.createEmbed({
                    description: '⛔ | you must join voice channel same as me to do this.'
                })]
            })
            return false
        }
        return true
    }

    loopStatus(status: string) {
        switch (status) {
            case 'none':
                return 'Not looping'

            case 'queue':
                return 'Looping queue 🔁'

            case 'track':
                return 'Looping track 🔂'

            default:
                return 'Invalid'
        }
    }

}