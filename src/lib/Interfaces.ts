import { PermissionResolvable, Snowflake, ClientEvents, Message, PermissionString } from 'discord.js';
import { default as EventEmitter } from 'events';
import { Command } from '.';
import { EVENTS_REASONS } from './Constants';

export type Permissions = 'clientPermissions' | 'userPermissions';

export interface CommandHandlerEvents {
	commandStarted: [message: Message, command: Command, args: unknown[]];
	commandFinished: [message: Message, command: Command, args: unknown[]];
	commandBlocked: [reason: keyof typeof EVENTS_REASONS, message: Message, command: Command];
	missingPermissions: [message: Message, command: Command, reason: Permissions, missing: PermissionString[]];
}

export interface IBaseModuleOptions {
	category: string;
}

// ! I know this is not the prettiest way to do it, if you have better ideas lmk, thanks.
export interface IEmitReasonArgs {
	key: keyof typeof EVENTS_REASONS;
	rest: any;
}

export interface ICommandHandlerOptions extends IBaseHandlerOptions {
	blockClient?: boolean;
	blockBots?: boolean;
	prefix?: string | string[];
	allowMention?: boolean;
	handleEdits?: boolean;
	fetchMembers?: boolean;
	ownersIgnorePermissions?: boolean;
}

export type IEventHandlerOptions = IBaseHandlerOptions;

export interface IParseResult {
	command: Command;
	prefix: string;
	alias: string;
	content: string;
	afterPrefix: string;
}

export interface IBaseHandlerOptions {
	extensions?: string[];
	directory: string;
	logging?: boolean;
}

interface IOptions {
	category?: string;
}

export interface ICommandOptions extends IOptions {
	aliases?: string[];
	clientPermissions?: PermissionResolvable | PermissionResolvable[];
	userPermissions?: PermissionResolvable | PermissionResolvable[];
	ownerOnly?: boolean;
	description?: Record<string, unknown>;
	channel?: 'guild' | 'dm';
}

export interface IEventOptions extends IOptions {
	emitter: string | EventEmitter;
	event: keyof ClientEvents | string;
	type?: 'on' | 'once';
}

export interface ILogTypes {
	info: string;
	checkpoint: string;
	success: string;
	warn: string;
	error: string;
}

export interface IShensuoClientOptions {
	owners?: Snowflake | Snowflake[];
	token?: string;
}
