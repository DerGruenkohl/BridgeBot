import type {
	AutocompleteInteraction,
	Awaitable,
	ButtonInteraction,
	ChannelSelectMenuInteraction,
	ChatInputCommandInteraction,
	Client,
	ClientEvents,
	ContextMenuCommandBuilder,
	MentionableSelectMenuInteraction,
	MessageContextMenuCommandInteraction,
	ModalSubmitInteraction,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	RoleSelectMenuInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
	StringSelectMenuInteraction,
	UserContextMenuCommandInteraction,
	UserSelectMenuInteraction,
} from "discord.js";

// Command Handler
export enum CommandType {
	ChatInput = 1,
	UserContextMenu = 2,
	MessageContextMenu = 3,
}

export type ChatInputCommandBuilder = SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder | RESTPostAPIChatInputApplicationCommandsJSONBody;

export interface CommandStructureChatInput<C extends Client<true>, O = {}, A extends any[] = unknown[]> {
	type: 1 | "ChatInput";
	structure: ChatInputCommandBuilder;
	options?: Partial<O>;
	run: (gooDzBot: C, interaction: ChatInputCommandInteraction, ...args: A) => Awaitable<void>;
	autocomplete?: (gooDzBot: C, interaction: AutocompleteInteraction, ...args: A) => Awaitable<void>;
	disabled?: boolean;
}

export interface CommandStructureUserContext<C extends Client<true>, O = {}, A extends any[] = unknown[]> {
	type: 2 | "UserContextMenu";
	structure: ContextMenuCommandBuilder;
	options?: Partial<O>;
	run: (gooDzBot: C, interaction: UserContextMenuCommandInteraction, ...args: A) => Awaitable<void>;
	autocomplete?: never;
	disabled?: boolean;
}

export interface CommandStructureMessageContext<C extends Client<true>, O = {}, A extends any[] = unknown[]> {
	type: 3 | "MessageContextMenu";
	structure: ContextMenuCommandBuilder;
	options?: Partial<O>;
	run: (gooDzBot: C, interaction: MessageContextMenuCommandInteraction, ...args: A) => Awaitable<void>;
	autocomplete?: never;
	disabled?: boolean;
}

export type CommandStructure<C extends Client<true>, O = {}, A extends any[] = unknown[]> = CommandStructureChatInput<C, O, A> | CommandStructureUserContext<C, O, A> | CommandStructureMessageContext<C, O, A>;

// Events Handler
export interface EventStructure<C extends Client, K extends keyof ClientEvents> {
	event: K;
	once?: boolean;
	run: (gooDzBot: C, ...args: ClientEvents[K]) => Awaitable<void>;
}

export interface CustomEventStructure<C extends Client, I extends { [k: string]: any[] }, K extends keyof I> {
	event: K;
	once?: boolean;
	run: (gooDzBot: C, ...args: I[K]) => Awaitable<void>;
}

// Components Handler
export enum ComponentType {
	Button = 1,
	StringSelect = 2,
	UserSelect = 3,
	RoleSelect = 4,
	MentionableSelect = 5,
	ChannelSelect = 6,
	Modal = 7,
}

export interface ComponentStructureButton<C extends Client<true>> {
	type: ComponentType.Button;
	customId: string;
	run: (gooDzBot: C, interaction: ButtonInteraction) => Awaitable<void>;
	useMatch?: boolean;
	disabled?: boolean;
	cooldown?: number;
}

export interface ComponentStructureStringSelect<C extends Client<true>> {
	type: ComponentType.StringSelect;
	customId: string;
	run: (gooDzBot: C, interaction: StringSelectMenuInteraction) => Awaitable<void>;
	useMatch?: boolean;
	disabled?: boolean;
	cooldown?: number;
}

export interface ComponentStructureUserSelect<C extends Client<true>> {
	type: ComponentType.UserSelect;
	customId: string;
	run: (gooDzBot: C, interaction: UserSelectMenuInteraction) => Awaitable<void>;
	useMatch?: boolean;
	disabled?: boolean;
	cooldown?: number;
}

export interface ComponentStructureRoleSelect<C extends Client<true>> {
	type: ComponentType.RoleSelect;
	customId: string;
	run: (gooDzBot: C, interaction: RoleSelectMenuInteraction) => Awaitable<void>;
	useMatch?: boolean;
	disabled?: boolean;
	cooldown?: number;
}

export interface ComponentStructureMentionableSelect<C extends Client<true>> {
	type: ComponentType.MentionableSelect;
	customId: string;
	run: (gooDzBot: C, interaction: MentionableSelectMenuInteraction) => Awaitable<void>;
	useMatch?: boolean;
	disabled?: boolean;
	cooldown?: number;
}

export interface ComponentStructureChannelSelect<C extends Client<true>> {
	type: ComponentType.ChannelSelect;
	customId: string;
	run: (gooDzBot: C, interaction: ChannelSelectMenuInteraction) => Awaitable<void>;
	useMatch?: boolean;
	disabled?: boolean;
	cooldown?: number;
}

export interface ComponentStructureModalSubmit<C extends Client<true>> {
	type: ComponentType.Modal;
	customId: string;
	run: (gooDzBot: C, interaction: ModalSubmitInteraction) => Awaitable<void>;
	useMatch?: boolean;
	disabled?: boolean;
	cooldown?: number;
}

export type ComponentStructure<C extends Client<true>> = ComponentStructureButton<C> | ComponentStructureStringSelect<C> | ComponentStructureUserSelect<C> | ComponentStructureRoleSelect<C> | ComponentStructureMentionableSelect<C> | ComponentStructureChannelSelect<C> | ComponentStructureModalSubmit<C>;
