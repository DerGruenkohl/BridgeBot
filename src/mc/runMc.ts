import { chat } from './listners/ChatListner.ts';
import { client } from '../discord/runBot.ts';

const mineflayer = require('mineflayer');
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const registry = require('prismarine-registry')('1.8.9')
const ChatMessage = require('prismarine-chat')(registry)
require('dotenv').config()


export let bot = mineflayer.createBot({
  host: 'mc.hypixel.net', // minecraft server ip
  username: process.env.ACC_UUID, // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
  auth: 'microsoft', // for offline mode servers, you can set this to 'offline'
  port: 25565,              // set if you need a port that isn't 25565
  version: "1.8.9",           // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
})



export async function mcBot(){
  bot.on('message', (jsonMsg: any) => {
    const msg = new ChatMessage(jsonMsg);
    chat(msg)
  })

  bot.once('spawn', () => {
    bot.chat("/limbo")
    mineflayerViewer(bot, { port: 6969, firstPerson: true })
  })

  bot.on('error', (err: any) => console.log(`${client.prefix} ${err}`))
  bot.on('end', mcBot)
}