import { PermissionResolvable, Snowflake, Message, PermissionString } from 'discord.js';
import { default as EventEmitter } from 'events';
import { Command, BaseModule, EVENTS_REASONS, UnionEvents } from '.';

export interface IShensuoEvents {
	load: [module: BaseModule, isReload: boolean];
	remove: [module: BaseModule];
	commandStarted: [message: Message, command: Command, args: unknown[]];
	commandFinished: [message: Message, command: Command, args: unknown[], returnValue: unknown[]];
	commandBlocked: [message: Message, command: Command, reason: keyof typeof EVENTS_REASONS];
	missingPermissions: [message: Message, command: Command, type: string, missing: PermissionString[]];
}

// ! I know this is not the prettiest way to do it, if you have better ideas lmk, thanks.
export interface IEmitReasonArgs {
	key: keyof typeof EVENTS_REASONS;
	rest: any;
}

export type IEventHandlerOptions = IBaseHandlerOptions;

export interface IEventOptions extends IOptions {
	emitter: string | EventEmitter;
	event: UnionEvents | string;
	type?: 'on' | 'once';
}

export interface IBaseModuleOptions {
	category: string;
}

export interface ICommandHandlerOptions extends IBaseHandlerOptions {
	blockClient?: boolean;
	blockBots?: boolean;
	prefix?: string | string[];
	allowMention?: boolean;
	handleEdits?: boolean;
	fetchMembers?: boolean;
}

export interface ICommandOptions extends IOptions {
	aliases?: string[];
	clientPermissions?: PermissionResolvable | PermissionResolvable[];
	userPermissions?: PermissionResolvable | PermissionResolvable[];
	ownerOnly?: boolean;
	description?: Record<string, unknown>;
	channel?: 'guild' | 'dm';
}

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
