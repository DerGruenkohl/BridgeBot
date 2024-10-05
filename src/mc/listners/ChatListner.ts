import { ChatMessage } from 'prismarine-chat';
import { client } from '../../discord/runBot.ts';
import { EmbedBuilder, TextChannel } from 'discord.js';

export async function chat(message: ChatMessage) {
  const msg = message.toString()
  console.log(`${client.prefix} ${msg}`)
  const target = [
    "has muted",
    "was kicked from the guild",
    "has unmuted",
    "joined the guild"
  ]

  const e = target.filter(it => msg.toLowerCase().includes(it.toLowerCase()));

  if(e.length > 0){
   const channel = await client.channels.fetch(process.env.Mod_Log as string) as TextChannel;
    await channel.send({
      embeds: [
        baseEmbed.setDescription(`${e[0].replace("-----------------------------------------------------", "")}`)
      ]
    })

    return;
  }
  if(!msg.includes(":")){
    return;
  }
  if (msg.startsWith("Officer > ")){
    const channel = await client.channels.fetch(process.env.Officer_Channel as string) as TextChannel;
    await channel.send({
      embeds: [
        baseEmbed.setDescription(msg)
      ]
    })
    return;
  }
  if (msg.startsWith("Guild > ")){
    const channel = await client.channels.fetch(process.env.Guild_Channel as string) as TextChannel;
    await channel.send({
      embeds: [
        baseEmbed.setDescription(msg)
      ]
    })
    return;
  }

}

const baseEmbed = new EmbedBuilder({
  title: "GuildBridge",
  color: client.Colors.DarkVividPink,
  footer: client.Footer
})