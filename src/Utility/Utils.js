const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration)

module.exports = {


    CreateEmbed(color = '#c6d7f5') {
        return new MessageEmbed()
            .setColor(color)
    },


    CreatePrompt(prompt) {
        return stripIndents`
    **❔ |** *${prompt}*
    **🔘 |** *You have \`30\` seconds to decide*
    **🔘 |** *Type \`cancel\` to cancel*
    `;
    },


    chunk(...args) {
        const [arr, len] = args;
        const rest = [];
        for (let i = 0; i < arr.length; i += len) { rest.push(arr.slice(i, i + len)); }
        return rest;
    },

    getDurationString(vidDuration) {
        return dayjs.duration(vidDuration)
            .format('HH:mm:ss')
    }

}