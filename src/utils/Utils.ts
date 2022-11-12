import { stripIndents } from 'common-tags'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

export class Utils {

    // https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812
    CreateEmbed(embed): any {
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

    CreatePrompt(prompt) {
        return stripIndents`
    **❔ |** *${prompt}*
    **🔘 |** *You have \`30\` seconds to decide*
    **🔘 |** *Type \`cancel\` to cancel*
    `;
    }

    chunk(...args) {
        const [arr, len] = args;
        const rest: Array<any> = [];
        for (let i = 0; i < arr.length; i += len) { rest.push(arr.slice(i, i + len)); }
        return rest;
    }

    getDurationString(vidDuration) {
        return dayjs.duration(vidDuration)
            .format('HH:mm:ss')
    }

}