const { Listener } = require('discord-akairo');

module.exports = class trackStart extends Listener {
  constructor() {
    super('trackStart', {
      event: 'trackStart',
      emitter: 'erela',
    });
  }

  async exec(player, track) {
    const QueueChannel = this.client.channels.cache.get(player.textChannel);
    const sendMessage = await QueueChannel.send({
      embeds: [
        this.client.utils.CreateEmbed()
          .setAuthor({
            name: 'Now Playing',
            url: `${track.uri}`
          })
          .setTitle(`${track.title}`)
          .setURL(`${track.uri}`)
          .setThumbnail(`${track.thumbnail}`)
          .setDescription(`\`Length:\` ${this.client.utils.getDurationString(track.duration)}\n\n\`Requested by\`: ${track.requester}`)
          .setFields([
            {
              name: 'Next Up',
              value: `${player.queue.length == 0 ? '\`Nothing\`' : `\`${player.queue[0].title}\``}`
            }])
          
      ]
    });
    if (track.isStream) return;
    setTimeout(() => sendMessage.delete(), track.duration);
  }
};
