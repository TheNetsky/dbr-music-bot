import { Client } from './Client'


export abstract class Event {
  client: Client
  name: string
  once: boolean

  constructor(client: Client, name: string, once = false) {
    this.client = client
    this.name = name
    this.once = once

    this.execute = this.execute.bind(this)
  }

  /**
   * @param {Client} client client
   */
  abstract execute(client: Client, ...args: any[]): Promise<any>;
}
