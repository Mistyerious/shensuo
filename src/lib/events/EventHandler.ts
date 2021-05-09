// import { Collection, Message, PartialMessage } from 'discord.js';
// import { IEventHandlerOptions, IParseResult, EVENTS, ShensuoClient, Command, Logger } from '..';
// import { BaseHandler } from '../extendable/BaseHandler';

// export class ListenerHandler extends BaseHandler {
// 	public readonly aliases: Collection<string, string> = new Collection();
// 	public readonly modules: Collection<string, Command> = new Collection();
// 	protected readonly _options: IEventHandlerOptions;

// 	public constructor(public readonly client: ShensuoClient, { extensions = ['.js', '.ts'], logging = true, directory }: IEventHandlerOptions) {
// 		super(client, {
// 			extensions,
// 			directory,
// 			logging,
// 		});

// 		this._options = {
// 			extensions,
// 			logging,
// 			directory,
// 		};
// 	}

// 	public register(command: Command, path: string): void {
// 		super.register(command, path);

// 		if (!command.options.aliases || command.options.aliases.length === 0) command.options.aliases = [command.identifier];

// 		for (const alias of command.options.aliases) {
// 			const conflict: string | undefined = this.aliases.get(alias.toLowerCase());

// 			if (conflict) {
// 				Logger.exit(1, `Command ${command.identifier} has conflicting alias '${alias}' with command '${conflict}'`);
// 				return;
// 			}

// 			this.aliases.set(alias.toLowerCase(), command.identifier);
// 		}
// 	}

// 	public deregister(command: Command): void {
// 		command.options.aliases ??= [];
// 		for (const alias of command.options.aliases) this.aliases.delete(alias.toLowerCase());
// 		super.deregister(command);
// 	}

// 	protected async _handle(message: Message): Promise<void> {
// 		if (this._options.fetchMembers && message.guild && !message.member && !message.webhookID) await message.guild.members.fetch(message.author);

// 		const { command, content, alias, prefix } = this._parseCommand(message);
// 		if (!command) return;

// 		await this._runCommand(message, command, content?.slice(alias?.length! + prefix?.length!).split(/ +/));
// 	}

// 	protected async _runCommand(message: Message, command: Command, args: unknown): Promise<void> {
// 		this.emit(EVENTS.COMMAND_HANDLER.COMMAND_STARTED, message, command, args);
// 		await command.exec(message, args);
// 		this.emit(EVENTS.COMMAND_HANDLER.COMMAND_FINISHED, message, command, args);
// 	}

// 	protected _parseCommand(message: Message): Partial<IParseResult> {
// 		if (this._options.allowMention) this._options.prefix = [...[`<@${this.client.user?.id}>`, `<@!${this.client.user?.id}>`], ...(Array.isArray(this._options.prefix) ? this._options.prefix : [this._options.prefix!])];
// 		return this._parsePrefix(message, this._options.prefix);
// 	}

// 	protected _parsePrefix(message: Message, prefix?: string | string[]): Partial<IParseResult> {
// 		const lowerContent: string = message.content.toLowerCase();

// 		if (Array.isArray(prefix)) prefix = prefix.find((prefix: string): boolean => lowerContent.startsWith(prefix));
// 		if (!prefix) return {};

// 		const startOfArgs: number = message.content.slice(lowerContent.indexOf(prefix.toLowerCase()) + prefix.length).search(/\S/) + prefix.length;
// 		const alias: string = message.content.slice(startOfArgs).split(/\s{1,}|\n{1,}/)[0];

// 		return {
// 			command: this.findCommand(alias),
// 			prefix,
// 			alias,
// 			content: message.content.slice(startOfArgs + (alias.length + 1)).trim(),
// 			afterPrefix: message.content.slice(prefix.length).trim(),
// 		};
// 	}

// 	public findCommand(name: string): Command | undefined {
// 		return this.modules.get(this.aliases.get(name.toLowerCase())!);
// 	}
// }
