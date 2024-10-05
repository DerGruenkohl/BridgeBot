import { Client, ClientEvents,  GatewayIntentBits } from 'discord.js';
import { CommandsHandler } from './CommandsHandler.ts';
import { ComponentsHandler } from './ComponentsHandler.ts';
import { EventsHandler } from './EventsHandler.ts';
import { join } from 'node:path';
import chalk from 'chalk';
import { Colors, Footer } from './utils/Constants.ts';

export default class Bot<Ready extends boolean = boolean> extends Client<Ready>{
  public readonly prefix: string;
  public readonly Colors: typeof Colors;
  public readonly Footer: typeof Footer

  public commandsHandler: CommandsHandler<Bot>;
  public componentsHandler: ComponentsHandler<Bot<true>>;
  public eventsHandler: EventsHandler<Bot, keyof ClientEvents>;

  constructor({ commandsFolder, componentsFolder, eventsFolder }: { commandsFolder: string; componentsFolder: string; eventsFolder: string } = { commandsFolder: "commands", componentsFolder: "components", eventsFolder: "events" }) {
    super({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions],
    });
    this.prefix = `[${chalk.magenta("GuildBridge")}]`;
    this.Colors = Colors;
    this.Footer = Footer

    this.commandsHandler = new CommandsHandler<Bot>(join(__dirname, "..", commandsFolder));
    this.componentsHandler = new ComponentsHandler<Bot<true>>(join(__dirname, "..", componentsFolder));
    this.eventsHandler = new EventsHandler<Bot>(join(__dirname, "..", eventsFolder));

  }
}