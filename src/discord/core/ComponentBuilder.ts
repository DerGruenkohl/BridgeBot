import type { Client } from "discord.js";
import type { ComponentStructure } from "./types";

export class ComponentBuilder<C extends Client<true>> {
	private readonly disabled?: ComponentStructure<C>["disabled"];
	public readonly type: ComponentStructure<C>["type"];
	public readonly customId: ComponentStructure<C>["customId"];
	public readonly useMatch?: ComponentStructure<C>["useMatch"];
	public readonly run: ComponentStructure<C>["run"];
	public readonly cooldown: ComponentStructure<C>["cooldown"];

	constructor(data: ComponentStructure<C>) {
		this.type = data.type;
		this.customId = data.customId;
		this.run = data.run;
		this.disabled = data.disabled;
		this.useMatch = data.useMatch;
		this.cooldown = data.cooldown;
	}

	toJSON(): ComponentStructure<C> {
		return {
			type: this.type,
			customId: this.customId,
			run: this.run,
			disabled: this.disabled,
			useMatch: this.useMatch,
			cooldown: this.cooldown,
		} as ComponentStructure<C>;
	}
}
