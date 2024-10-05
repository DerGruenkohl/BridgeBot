import { EventEmitter } from "node:events";
import { Client, Collection, type Interaction, PermissionsBitField } from "discord.js";
import { ComponentBuilder } from "./ComponentBuilder";
import { type ComponentStructure, ComponentType } from "./types";
import { importFromDir } from "./utils";

export class ComponentsHandler<C extends Client<true>> extends EventEmitter {
	public readonly collection: Collection<string, ComponentStructure<C>> = new Collection();
	public readonly path: string;
	public readonly includesDir?: boolean = false;
	public readonly cooldowns?: Map<ComponentType, Map<string, number>>;

	/**
	 * Creates a new handler for Discord bot client's interaction components events.
	 * @param {string} path The directory path.
	 * @param {boolean | undefined} includesDir Whenever the directory has sub-dirs or not.
	 * @typeParam {Client} C The Discord bot Client.
	 */
	constructor(path: string, includesDir?: boolean) {
		super();
		if (!path) throw new Error("MissingRequiredParameter: 'path' is required for the constructor.");

		if (includesDir && typeof includesDir !== "boolean") throw new Error("InvalidParameterType: 'includesDir' is not type of boolean.");

		this.path = path;
		this.includesDir = includesDir;
		this.cooldowns = new Map<ComponentType, Map<string, number>>();
	}

	/**
	 * Creates a new component for the handler.
	 *
	 * **Warning**: Make sure that you have exported it as `default`.
	 *
	 * ```ts
	 * // TypeScript
	 * export default new [handler].component(...);
	 *
	 * // JavaScript (CommonJS)
	 * module.exports = new [handler].component(...);
	 * ```
	 */
	public component = class extends ComponentBuilder<C> {
		// biome-ignore lint/complexity/noUselessConstructor: <explanation>
		constructor(data: ComponentStructure<C>) {
			super(data);
		}
	};

	public getInteractionType(interaction: Interaction) {
		if (interaction.isButton()) return ComponentType.Button;
		if (interaction.isStringSelectMenu()) return ComponentType.StringSelect;
		if (interaction.isUserSelectMenu()) return ComponentType.UserSelect;
		if (interaction.isRoleSelectMenu()) return ComponentType.RoleSelect;
		if (interaction.isMentionableSelectMenu()) return ComponentType.MentionableSelect;
		if (interaction.isChannelSelectMenu()) return ComponentType.ChannelSelect;
		if (interaction.isModalSubmit()) return ComponentType.Modal;
	}

	/**
	 * Loads all components from the provided path.
	 * @param {C} defaultListener The options.
	 */
	public load(defaultListener?: C): Promise<ComponentStructure<C>[]> {
		return new Promise(async (resolved, rejected) => {
			try {
				const data = await importFromDir<ComponentStructure<C>>(this.path, {
					includesDir: this.includesDir,
				});

				for (const module of data) {
					if (!module.customId || !module.type || !module.run || module.disabled) {
						this.emit("fileSkip", module.customId, module.type);
						continue;
					}
					this.collection.set(module.customId, module);

					this.emit("fileLoad", module.customId, module.type);
				}

				if (defaultListener) {
					const client = defaultListener;

					if (!(client instanceof Client)) throw new TypeError("client is not instance of Client.");

					client.on("interactionCreate", async (interaction) => {
						if (!interaction.isButton() && !interaction.isStringSelectMenu() && !interaction.isUserSelectMenu() && !interaction.isRoleSelectMenu() && !interaction.isMentionableSelectMenu() && !interaction.isChannelSelectMenu() && !interaction.isModalSubmit()) return;

						const cooldownKey = `${interaction.guildId ?? "private"}-${interaction.user.id}-${interaction.customId ?? "NULL"}`;

						for (const [_, module] of this.collection) {
							const interactionType = this.getInteractionType(interaction);
							if (interactionType != module.type) continue;
							if (module.useMatch ? !interaction.customId.match(module.customId) : interaction.customId !== module.customId) continue;

							let moduleRun = false;

							if (!this.cooldowns?.has(module.type)) {
								this.cooldowns?.set(module.type, new Map());
							}

							const moduleCooldowns = this.cooldowns?.get(module.type);

							if (moduleCooldowns?.has(cooldownKey) && interactionType === module.type) {
								const cooldown = moduleCooldowns.get(cooldownKey);
								if (typeof cooldown != "number") return;

								if (!interaction.customId.match(module.customId) && interaction.customId !== module.customId) continue;

								if ((cooldown >= Date.now()) && !((interaction.guild?.members.cache.get(interaction.user.id))?.permissions.has(PermissionsBitField.Flags.Administrator))) {
									if (interaction.isRepliable()) {
										await interaction.reply({
											content: `Bitte warte noch ${((cooldown - Date.now()) / 1000).toFixed(0)} Sekunden bevor du es wieder versuchst!`,
											ephemeral: true,
										});
									}
									return;
								}
								moduleCooldowns.delete(cooldownKey);
							}

							if (interaction.isButton() && module.type === ComponentType.Button) {
								await module.run(client, interaction);
								moduleRun = true;
							}
							if (interaction.isStringSelectMenu() && module.type === ComponentType.StringSelect) {
								await module.run(client, interaction);
								moduleRun = true;
							}
							if (interaction.isUserSelectMenu() && module.type === ComponentType.UserSelect) {
								await module.run(client, interaction);
								moduleRun = true;
							}
							if (interaction.isRoleSelectMenu() && module.type === ComponentType.RoleSelect) {
								await module.run(client, interaction);
								moduleRun = true;
							}
							if (interaction.isMentionableSelectMenu() && module.type === ComponentType.MentionableSelect) {
								await module.run(client, interaction);
								moduleRun = true;
							}
							if (interaction.isChannelSelectMenu() && module.type === ComponentType.ChannelSelect) {
								await module.run(client, interaction);
								moduleRun = true;
							}

							if (interaction.isModalSubmit() && module.type === ComponentType.Modal) {
								await module.run(client, interaction);
								moduleRun = true;
							}

							if (module.cooldown && moduleRun && interactionType === module.type) {
								moduleCooldowns?.set(cooldownKey, Date.now() + module.cooldown);
							}
						}
					});
				}

				resolved(data);
			} catch (e) {
				rejected(e);
			}
		});
	}

	/**
	 * Reloads all components from the provided path.
	 */
	public reload(): Promise<ComponentStructure<C>[]> {
		return new Promise(async (resolved, rejected) => {
			try {
				this.collection.clear();

				const output = await this.load();

				resolved(output);
			} catch (e) {
				rejected(e);
			}
		});
	}

	public addComponents(...components: ComponentStructure<C>[]) {
		for (const component of components) {
			if (!component || !component.customId || !component.type || !component.run) continue;

			this.collection.set(component.customId, component);
		}

		return this;
	}

	public setComponents(...components: ComponentStructure<C>[]) {
		this.collection.clear();

		for (const component of components) {
			if (!component || !component.customId || !component.type || !component.run) continue;

			this.collection.set(component.customId, component);
		}

		return this;
	}
}
