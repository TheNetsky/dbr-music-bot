import 'dotenv/config'
import { CommandClient } from 'eris'
import readdirRecursive from '../Util/ReaddirRecursive';
import { join } from 'path'
import { Manager } from 'erela.js'
import { Spotify } from 'better-erela.js-spotify'
import Jsoning from 'jsoning'
import config from '../../config.json'
import { Utils } from '../Util/Utils'
import { logger } from '../Util/Logger'


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
      });
  }

  public db = new Jsoning('db.json')
  public logger = logger
  public utils = new Utils()
  public config = config

  public erela = new Manager({
    nodes: config.nodes,
    plugins: [
      new Spotify()
    ],
    send: (id, payload) => {
      const guild = this.guilds.get(id);
      if (guild) guild.shard.sendWS(payload.op, payload.d);
    },
  })

  public loadCommands() {
    for (const files of readdirRecursive(join(__dirname, '..', 'Commands'))) {
      const commandFiles = require(files).default;
      const command = new commandFiles(this);

      logger.info(`registering ${command.label} command with category ${command.category}`)

      const erisCommand = this.registerCommand(command.label, command.execute)

      erisCommand.category = command.category;
      erisCommand.client = command.client;
      erisCommand.description = command.description;
      for (const aliases of command.aliases) {
        this.registerCommandAlias(aliases, command.label);
      }
    }
  }

  public init() {
    this.connect();
    this.loadCommands();
  }
}

declare module 'eris' {
  export interface Command {
    category: string,
    client: Client
  }
}