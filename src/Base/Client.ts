import 'dotenv/config'
import { CommandClient } from 'eris'
import readdirRecursive from '../utils/ReaddirRecursive';
import { EventHandler } from 'handlers/EventHandler'
import { CommandHandler } from 'handlers/CommandHandler'
import { join } from 'path'
import { Manager } from 'erela.js'
import { Spotify } from 'better-erela.js-spotify'
import Jsoning from 'jsoning'
import config from '../../config.json'
import { Utils } from '../utils/Utils'
import { logger } from '../utils/Logger'


export class Client extends CommandClient {

  public constructor() {
    super(process.env['DISCORD_TOKEN'] as string,
      {
        intents: ['guildMessages', 'guildVoiceStates', 'guilds', 'guildMessageReactions', 'guildMembers'],
      },
      {
        prefix: config.prefix,
        owner: config.owner,
        ignoreBots: true,
        ignoreSelf: true,
        defaultHelpCommand: false,
      })

    new EventHandler(this).loadEvents()
    new CommandHandler(this).loadCommands()
  }

  public utils = new Utils()
  public db = new Jsoning('db.json')
  public logger = logger
  public config = config

  public erela = new Manager({
    nodes: config.nodes,
    plugins: [
      new Spotify()
    ],
    send: (id, payload) => {
      const guild = this.guilds.get(id);
      if (guild) guild.shard.sendWS(payload.op, payload.d);
    }
  })

  public init() {
    this.connect()
  }
}

declare module 'eris' {
  export interface Command {
    category: string,
    client: Client
  }
}