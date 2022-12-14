import { Structure } from 'erela.js'
import WebSocket from 'ws'
import { version } from '../../package.json'


class Node extends Structure.get('Node') {
  connect() {
    if (this.connected) return

    const headers = {
      Authorization: this.options.password,
      'Num-Shards': String(this.manager.options.shards),
      'User-Id': this.manager.options.clientId,
      'Client-Name': this.manager.options.clientName,
      'User-Agent': `DBR v${version}`
    }

    this.socket = new WebSocket(`ws${this.options.secure ? 's' : ''}://${this.options.host}:${this.options.port}/`,
      {
        headers
      })

    this.socket.on('open', this.open.bind(this))
    this.socket.on('close', this.close.bind(this))
    this.socket.on('message', this.message.bind(this))
    this.socket.on('error', this.error.bind(this))
  }
}

Structure.extend('Node', () => Node)