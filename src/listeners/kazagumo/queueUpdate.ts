import { KazagumoPlayer, KazagumoQueue } from 'kazagumo'

import { Client } from '../../structures/Client'
import { Event } from '../../structures/Event'


export default class queueUpdateEvent extends Event {
  constructor(client: Client) {
    super(client, 'queueUpdate', true)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(client: Client, player: KazagumoPlayer, queue: KazagumoQueue) {
    // Does not seem to be working, no events are ever received here?
    //console.log(queue)
  }
}