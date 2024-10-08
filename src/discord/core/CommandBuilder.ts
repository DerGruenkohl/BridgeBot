import type { Client } from "discord.js";
import type { CommandStructure } from "./types";

export class CommandBuilder<C extends Client, O = {}, A extends any[] = unknown[]> {
	private readonly disabled: CommandStructure<C, O, A>["disabled"] = false;
	public readonly type: CommandStructure<C, O, A>["type"];
	public readonly structure: CommandStructure<C, O, A>["structure"];
	public readonly options: Partial<CommandStructure<C, O, A>["options"]>;
	public readonly run: CommandStructure<C, O, A>["run"];
	public readonly autocomplete: CommandStructure<C, O, A>["autocomplete"];

	constructor(data: CommandStructure<C, O, A>) {
		this.type = data.type;
		this.structure = data.structure;
		this.options = data.options;
		this.run = data.run;
		this.autocomplete = data.autocomplete;
		this.disabled = data.disabled;
	}

	toJSON(): CommandStructure<C, O, A> {
		return {
			type: this.type,
			structure: this.structure,
			options: this.options,
			run: this.run,
			autocomplete: this.autocomplete,
			disabled: this.disabled,
		} as CommandStructure<C, O, A>;
	}
}
