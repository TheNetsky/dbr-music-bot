import 'dotenv/config'
import { CommandClient } from 'eris'
import { EventHandler } from 'handlers/EventHandler'
import { CommandHandler } from 'handlers/CommandHandler'
import { Manager } from 'erela.js'
import { Spotify } from 'better-erela.js-spotify'
import config from '../../config.json'
import { Utils } from 'utils/Utils'
import { logger } from 'utils/Logger'
import commandChecks from 'utils/CommandChecks'
import Jsoning from 'jsoning'
const db = new Jsoning('db.json')

export class Client extends CommandClient {

  public constructor() {
    super(process.env['DISCORD_TOKEN'] as string,
      {
        intents: ['guildMessages', 'guildVoiceStates', 'guilds', 'guildMessageReactions', 'guildMembers'],
      },
      {
        prefix: config.prefixes,
        owner: config.devId,
        ignoreBots: true,
        ignoreSelf: true,
        defaultHelpCommand: true,
        defaultCommandOptions: {
          cooldown: 3000,
          guildOnly: true,
          requirements: {
            custom: commandChecks
          }
        }
      })

    new EventHandler(this).loadEvents()
    new CommandHandler(this).loadCommands()
  }

  public utils = new Utils(this)
  public db = db
  public logger = logger
  public config = config

  public erela = new Manager({
    nodes: config.nodes,
    plugins: [
      new Spotify()
    ],
    send: (id, payload) => {
      const guild = this.guilds.get(id)
      if (guild) guild.shard.sendWS(payload.op, payload.d)
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