import { PermissionResolvable, Snowflake } from 'discord.js';
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

export interface ICommandOptions {
	aliases?: string[];
	clientPermissions?: PermissionResolvable | PermissionResolvable[];
	userPermissions?: PermissionResolvable | PermissionResolvable[];
	ownerOnly?: boolean;
	description?: Record<string, unknown>;
	category?: string;
}

export interface ILogTypes {
	info: string;
	success: string;
	warn: string;
	error: string;
}

export interface IShensuoClientOptions {
	owners?: Snowflake | Snowflake[];
	token?: string;
}
