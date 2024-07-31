import 'dotenv/config'
import { CommandClient } from 'eris'
import { Connectors } from 'shoukaku'
import { Kazagumo } from 'kazagumo'
import Apple from 'kazagumo-apple'
import KazagumoFilter from 'kazagumo-filter'
import Deezer from 'kazagumo-deezer'

import { EventHandler } from '../handlers/EventHandler'
import { CommandHandler } from '../handlers/CommandHandler'

import { Utils } from '../utils/Utils'
import { logger } from '../utils/Logger'
import commandChecks from '../utils/CommandChecks'

import config from '../../config.json'

export class Client extends CommandClient {
  public utils: Utils
  public logger = logger
  public config = config
  public memStorage: Map<string, any>
  public kazagumo: Kazagumo

  public constructor() {
    super(process.env['DISCORD_TOKEN'] as string,
      {
        intents: ['guildMessages', 'guildVoiceStates', 'guilds', 'guildMessageReactions', 'guildMembers']
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

    this.memStorage = new Map()

    new EventHandler(this).loadEvents()
    new CommandHandler(this).loadCommands()

    this.utils = new Utils(this)

    this.kazagumo = new Kazagumo({
      plugins: [
        new Apple({
          countryCode: 'us',
          imageWidth: 600,
          imageHeight: 900
        }),
        new KazagumoFilter(),
        new Deezer()
      ],

      defaultSearchEngine: 'youtube',

      send: (id, payload) => {
        const guild = this.guilds.get(id)
        if (guild) guild.shard.sendWS(payload.op, payload.d)
      }
    }, new Connectors.Eris(this), config.nodes)
  }

  public init() {
    this.connect()
  }
}

declare module 'eris' {
  export interface Command {
    category: string;
    client: Client;
  }
}