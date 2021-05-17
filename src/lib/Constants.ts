import { Message, PermissionString } from "discord.js";
import { BaseModule, Command } from ".";

export const EVENTS = {
	BASE_HANDLER: {
		LOAD: 'load',
		REMOVE: 'remove',
	},
	COMMAND_HANDLER: {
		COMMAND_STARTED: 'commandStarted',
		COMMAND_FINISHED: 'commandFinished',
		COMMAND_BLOCKED: 'commandBlocked',
		MISSING_PERMISSIONS: 'missingPermissions',
	},
};

export const EVENTS_REASONS = {
	owner: ({ message, command }: { message: Message; command: Command }): string => `The execution of the command '${command.identifier}' was blocked as the user '${message.author.tag}' (${message.author.id}) is not an owner.`,
	guild: ({ command }: { _message: Message; command: Command }): string => `The execution of the command '${command.identifier}' was blocked as the command was not executed in a guild.`,
	dm: ({ command }: { _message: Message; command: Command }): string => `The execution of the command '${command.identifier}' was blocked as the command was not executed in DM.`,
	client: ({ command }: { _message: Message; command: Command }): string => `The execution of the command '${command.identifier}' was blocked as the author of the command was the client.`,
	bot: ({ command }: { _message: Message; command: Command }): string => `The execution of the command '${command.identifier}' was blocked as the author of the command was a bot.`,
	clientPermissions: ({ command }: { _message: Message; command: Command }): string => `The execution of the command '${command.identifier}' as the client didn't have enough permissions to execute the command.`,
	userPermissions: ({ command }: { _message: Message; command: Command }): string => `The execution of the command '${command.identifier}' as the user didn't have enough permissions to execute the command.`,
};
