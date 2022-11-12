import { join } from 'path';
import { Client } from '../Base/Client'
import readdirRecursive from './ReaddirRecursive'

export default class Listenerhandler {
    constructor(public client: Client) {
        for (const files of readdirRecursive(join(__dirname, '..', 'Listeners'))) {
            const listenerFiles = require(files).default;
            const listener = new listenerFiles(this.client);

            console.log(listener)

            switch (listener.emitter) {
                
                case 'client': {
                    switch (listener.type) {
                        case 'once': {
                            client.once(listener.event, (...args) => listener.run(...args));
                            break;
                        }
                        case 'on': {
                            client.on(listener.event, (...args) => listener.run(...args));
                            break;
                        }
                    }
                }
                    break;
                case 'erela': {
                    switch (listener.type) {
                        case 'once': {
                            client.erela.once(listener.event, (...args) => listener.run(...args))
                            break;
                        }
                        case 'on': {
                            client.erela.on(listener.event, (...args) => listener.run(...args))
                            break;
                        }
                    }
                } default :
            }
        }
    }
}