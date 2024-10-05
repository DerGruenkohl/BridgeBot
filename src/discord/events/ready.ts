
import { eventsHandler } from "../runBot";
import Bot from '../core/DcBot.ts';


export default new eventsHandler.event({
	event: "ready",
	once: true,
	async run(bot: Bot<boolean>) {
		await bot.commandsHandler.deploy(bot as Bot<true>);

		console.log(`${bot.prefix} ${bot.user?.tag} bot is now online!`);


	},
});
