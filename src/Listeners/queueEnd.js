const { Listener } = require('discord-akairo')

module.exports = class queueEnd extends Listener {
  constructor() {
    super('queueEnd', {
      event: 'queueEnd',
      emitter: 'erela',
    })
  }

  exec(player) {

    if (!this.client.db.get(`${player.guild}_leaveOnQueueEnd`)) return

    const QueueChannel = this.client.channels.cache.get(player.textChannel)
    QueueChannel.send({ embeds: [this.client.utils.CreateEmbed().setDescription('⏹ | queue has ended.')] })
    player.destroy()
  }
}