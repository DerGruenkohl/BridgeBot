import { client, commandsHandler } from '../runBot.ts';
import { ApplicationCommandOptionType, EmbedBuilder, GuildMember } from 'discord.js';
import { bot } from '../../mc/runMc.ts';

export default new commandsHandler.command({
  type: "ChatInput",
  structure: {
    name: "chat",
    description: "says a message in chat",
    options:[
      {
        name: "guild",
        description: "send a message in guild chat",
        options: [{ name: "msg", description: "the message to send", type: ApplicationCommandOptionType.String, required: true },],
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "officer",
        description: "send a message in officer chat",
        options: [{ name: "msg", description: "the message to send", type: ApplicationCommandOptionType.String, required: true },],
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
  },

  async run(bot2, interaction) {
    await interaction.deferReply({
      ephemeral: true,
    })

    const message = interaction.options.getString("msg")
    const author: GuildMember = interaction.member

    const name = author.displayName

    console.log(`${client.prefix} ${name}`)

    const subcommand = interaction.options.getSubcommand();
    const invalidChannel = new EmbedBuilder().setTitle("Invalid Channel").setColor(bot2.Colors.DarkRed);
    switch (subcommand) {
      case "guild":{
        const gc = process.env.Guild_Channel
        if (interaction.channel.id !== gc){
            await interaction.editReply({
              embeds: [
                invalidChannel
              ]
            })
            return;
        }
        bot.chat(`/gc ${name}: ${message}`)
        await interaction.editReply(`successfully send message ${message} in guild chat`);
        break;
      }
      case "officer":{
        const oc = process.env.Officer_Channel
        if (interaction.channel.id !== oc){
          await interaction.editReply({
            embeds: [
              invalidChannel
            ]
          })

          return;
        }

        bot.chat(`/go ${name}: ${message}`)
        await interaction.editReply(`successfully send message ${message} in officer chat`);
        break;
      }
    }


  },
});
