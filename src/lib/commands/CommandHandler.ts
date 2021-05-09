import { Collection, Message, PartialMessage, PermissionString } from 'discord.js';
import { ICommandHandlerOptions, IParseResult, EVENTS, ShensuoClient, Command, Logger } from '..';
import { EVENTS_REASONS } from '../Constants';
import { BaseHandler } from '../extendable/BaseHandler';
import { Util } from '../Util';

export class CommandHandler extends BaseHandler {
	public readonly aliases: Collection<string, string> = new Collection();
	public readonly modules: Collection<string, Command> = new Collection();
	protected readonly _options: ICommandHandlerOptions;

	public constructor(
		public readonly client: ShensuoClient,
		{ extensions = ['.js', '.ts'], handleEdits = true, blockClient = true, blockBots = true, prefix = '!', allowMention = true, logging = true, directory, fetchMembers = false, ownersIgnorePermissions = true }: ICommandHandlerOptions,
	) {
		super(client, {
			extensions,
			directory,
			logging,
		});

		this._options = {
			extensions,
			handleEdits,
			blockClient,
			blockBots,
			prefix,
			allowMention,
			logging,
			directory,
			fetchMembers,
			ownersIgnorePermissions,
		};

			this.client.on(
				'message',
				async (message: Message): Promise<void> => {
					if ((this._options.blockClient && message.author.id === this.client.user?.id) || (this._options.blockBots && message.author.bot)) return;
					if (message.partial) await message.fetch();

					await this._handle(message as Message);
				},
			);

			if (this._options.handleEdits)
				this.client.on(
					'messageUpdate',
					async (oldMessage: Message | PartialMessage, message: Message | PartialMessage): Promise<void> => {
						for (const msg of [oldMessage, message]) if (msg.partial) await msg.fetch();
						if (oldMessage.content === message.content) return;

						this._handle(message as Message);
					},
				);
	}

	public register(command: Command, path: string): void {
		super.register(command, path);

		if (!command.options.aliases || command.options.aliases.length === 0) command.options.aliases = [command.identifier];

		for (const alias of command.options.aliases) {
			const conflict: string | undefined = this.aliases.get(alias.toLowerCase());
			if (conflict) return Logger.exit(1, `Command ${command.identifier} has conflicting alias '${alias}' with command '${conflict}'`);
			this.aliases.set(alias.toLowerCase(), command.identifier);
		}
	}

	public deregister(command: Command): void {
		command.options.aliases ??= [];
		for (const alias of command.options.aliases) this.aliases.delete(alias.toLowerCase());
		super.deregister(command);
	}

	protected async _handle(message: Message): Promise<void> {
		if (this._options.fetchMembers && message.guild && !message.member && !message.webhookID) await message.guild.members.fetch(message.author);

		const { command, content, alias, prefix } = this._parseCommand(message);

		if (!command) return;
		if (await this._handlePermissions(message, command)) return;

		await this._runCommand(message, command, content?.slice(alias?.length! + prefix?.length!).split(/ +/));
	}

	protected async _runCommand(message: Message, command: Command, args: unknown): Promise<void> {
		this.emit(EVENTS.COMMAND_HANDLER.COMMAND_STARTED, message, command, args);
		await command.exec(message, args);
		this.emit(EVENTS.COMMAND_HANDLER.COMMAND_FINISHED, message, command, args);
	}

	protected _parseCommand(message: Message): Partial<IParseResult> {
		if (this._options.allowMention) this._options.prefix = [...[`<@${this.client.user?.id}>`, `<@!${this.client.user?.id}>`], ...(Array.isArray(this._options.prefix) ? this._options.prefix : [this._options.prefix!])];
		return this._parsePrefix(message, this._options.prefix);
	}

	protected _parsePrefix(message: Message, prefix?: string | string[]): Partial<IParseResult> {
		const lowerContent: string = message.content.toLowerCase();

		if (Array.isArray(prefix)) prefix = prefix.find((prefix: string): boolean => lowerContent.startsWith(prefix));
		if (!prefix) return {};

		const startOfArgs: number = message.content.slice(lowerContent.indexOf(prefix.toLowerCase()) + prefix.length).search(/\S/) + prefix.length;
		const alias: string = message.content.slice(startOfArgs).split(/\s{1,}|\n{1,}/)[0];

		return {
			command: this.findCommand(alias),
			prefix,
			alias,
			content: message.content.slice(startOfArgs + (alias.length + 1)).trim(),
			afterPrefix: message.content.slice(prefix.length).trim(),
		};
	}

	protected _returnEmitReason(key: keyof typeof EVENTS_REASONS, ...args: [Message, Command]): string {
		return EVENTS_REASONS[key](...args);
	}

	protected _emitAndReturn<T>(returned: T, event: string, ...args: [keyof typeof EVENTS_REASONS, Message, Command]): T {
		this.emit(event, ...args);
		Util.logIfActivated(Logger.warn, this, this._returnEmitReason(...args));
		return returned;
	}

	protected async _handlePermissions(message: Message, command: Command): Promise<boolean> {
		if (command.options.ownerOnly && !this.client._options.owners?.includes(message.author.id)) return this._emitAndReturn<boolean>(true, EVENTS.COMMAND_HANDLER.COMMAND_BLOCKED, 'owner', message, command);
		if (command.options.channel === 'guild' && !message.guild) return this._emitAndReturn<boolean>(true, EVENTS.COMMAND_HANDLER.COMMAND_BLOCKED, 'guild', message, command);
		if (command.options.channel === 'dm' && message.guild) return this._emitAndReturn<boolean>(true, EVENTS.COMMAND_HANDLER.COMMAND_BLOCKED, 'owner', message, command);
		if (this._options.blockClient && message.author.id === this.client.user?.id) return this._emitAndReturn<boolean>(true, EVENTS.COMMAND_HANDLER.COMMAND_BLOCKED, 'client', message, command);
		if (this._options.blockBots && message.author.bot) return this._emitAndReturn<boolean>(true, EVENTS.COMMAND_HANDLER.COMMAND_BLOCKED, 'bot', message, command);
		if (await this._runPermissionsChecks(message, command)) return this._emitAndReturn<boolean>(true, EVENTS.COMMAND_HANDLER.COMMAND_BLOCKED, 'permissions', message, command);

		return false;
	}

	public async _runPermissionsChecks(message: Message, command: Command): Promise<boolean> {
		if (command.options.clientPermissions && message.guild) {
			const missing: PermissionString[] | undefined = message.guild.me?.permissionsIn(message.channel).missing(command.options.clientPermissions);
			
			if (missing && missing.length) {
				this.emit(EVENTS.COMMAND_HANDLER.MISSING_PERMISSIONS, message, command, 'client', missing);
				return true;
			}
		}

		if (command.options.userPermissions && !this.client._options.owners?.includes(message.author.id)) {
			if (message.guild && !message.member && !message.webhookID) await message.guild.members.fetch(message.author);
			const missing: PermissionString[] | undefined = message.member?.permissionsIn(message.channel).missing(command.options.userPermissions);

			if (missing && missing.length) {
				this.emit(EVENTS.COMMAND_HANDLER.MISSING_PERMISSIONS, message, command, 'user', missing);
				return true;
			}
		}

		return false;
	}

	public findCommand(name: string): Command | undefined {
		return this.modules.get(this.aliases.get(name.toLowerCase())!);
	}
}
