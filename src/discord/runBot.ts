import {Events} from 'discord.js';
import Bot from './core/DcBot.ts';

export const client = new Bot()
export const commandsHandler = client.commandsHandler
export const eventsHandler = client.eventsHandler
export const commandHandler = client.commandsHandler

export async function runBot() {

  commandsHandler.on("deployStart", () => console.log(`${client.prefix} Registering ${commandsHandler.collection.size} commands`));
  await client.commandsHandler.load()
  await client.eventsHandler.load(client)
  // @ts-ignore
  await client.componentsHandler.load(client)

  await client.login(process.env.DISCORD_TOKEN);
  client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  });

  client.commandsHandler.collection




}







