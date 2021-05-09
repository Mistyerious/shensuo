import { Message } from 'discord.js';
import { Command } from './commands';

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
	owner: (message: Message, command: Command) => `The execution of the command '${command.identifier}' was blocked as the user '${message.author.tag}' (${message.author.id}) is not an owner.`,
	guild: (_message: Message, command: Command) => `The execution of the command '${command.identifier}' was blocked as the command was not executed in a guild.`,
	client: (_message: Message, command: Command) => `The execution of the command '${command.identifier}' was blocked as the author of the command was the client.`,
	bot: (_message: Message, command: Command) => `The execution of the command '${command.identifier}' was blocked as the author of the command was a bot.`,
	permissions: (message: Message, command: Command) =>
		`The execution of the command '${command.identifier}' was blocked as the author '${message.author.tag}' (${message.author.id}) didn't have enough permissions to execute the command OR the bot doesn't have enough permissions to execute the command.`,
};
