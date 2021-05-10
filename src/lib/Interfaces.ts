import { PermissionResolvable, Snowflake, ClientEvents } from 'discord.js';
import { default as EventEmitter } from 'events';
import { Command } from '.';

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
