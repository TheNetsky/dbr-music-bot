import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { Player } from 'erela.js'
import { Message } from 'eris'
import { GuildData } from 'interfaces/GuildData'
import { Client } from 'structures/Client'
dayjs.extend(duration)


export class Utils {
    client: Client
    constructor(client: Client) {
        this.client = client
    }

    // https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812
    createEmbed(embed: any): any {
        let color: number
        switch (String(embed?.color).toUpperCase()) {
            case 'YELLOW':
                color = 16776960
                break
            case 'RED':
                color = 15548997
                break
            default:
                color = 9807270
        }
        return Object.assign(embed, { color: color })
    }

    chunk(...args: any[]) {
        const [arr, len] = args
        const rest: Array<any> = []
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
            const emptyProgress = size - progress;
            const progressBar = line.repeat(progress).replace(/.$/, slider)
            const emptyprogressBar = line.repeat(emptyProgress)
            const bar = progressBar + emptyprogressBar
            const calculated = (currentValue / maxValue) * 100
            return { bar, calculated }
        }
    }

    passedUserRequirements(msg: Message, guildPlayer: Player): boolean {
        if (!msg.member?.voiceState.channelID) {
            msg.channel.createMessage({
                embeds: [this.createEmbed({
                    description: '⛔ | you must join voice channel to do this.'
                })]
            })
            return false
        }

        if (msg.member?.voiceState.channelID !== guildPlayer.voiceChannel) {
            msg.channel.createMessage({
                embeds: [this.createEmbed({
                    description: '⛔ | you must join voice channel same as me to do this.'
                })]
            })
            return false
        }
        return true
    }

    async setGuildData(guildId: string, value: GuildData): Promise<GuildData> {
        const data: GuildData = await this.client.db.get(guildId)

        if (data) {
            const newData = Object.assign(data, value)
            await this.client.db.set(guildId, newData)
            return newData
        } else {
            await this.client.db.set(guildId, value)
            return value
        }
    }

    async getGuildData(guildId: string): Promise<GuildData | null> {
        const data: GuildData = await this.client.db.get(guildId)

        if (data) {
            return data
        } else {
            return null
        }
    }

}