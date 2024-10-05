import { commandsHandler, eventsHandler } from "../runBot";

export default new eventsHandler.event({
	event: "interactionCreate",
	async run(bot, interaction) {

		if (interaction.isChatInputCommand()) {
			const command = commandsHandler.collection.get(interaction.commandName);

			if (!command || (command.type !== 1 && command.type !== "ChatInput")) return;

			try {
				command.run(bot, interaction);
			} catch (e) {
				console.error(e);
			}
		} else if (interaction.isAutocomplete()) {
			const command = commandsHandler.collection.get(interaction.commandName);

			if (!command || (command.type !== 1 && command.type !== "ChatInput") || !command.autocomplete) return;

			try {
				command.autocomplete(bot, interaction);
			} catch (e) {
				console.error(e);
			}
		}
	},
});
