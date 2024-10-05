import { Colors as DiscordColors } from "discord.js";

export const Colors = {
  ...DiscordColors,
};
export const Footer = {
  text: `${new Date().getUTCHours()}:${new Date().getUTCMinutes()} UTC`,
  iconURL: "https://minecraft.wiki/images/Wheat_JE2_BE2.png",
};