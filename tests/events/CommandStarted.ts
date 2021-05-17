import { Command, Event } from '../../src/';
import { Message } from 'discord.js';

export default class CommandStarted extends Event<'commandStarted'> {
	public constructor() {
		super('commandStarted', {
			emitter: 'commandHandler',
			event: 'commandStarted',
		});
	}

	public exec(_: Message, command: Command): void {
		this.client?.logger.info(`${command.identifier} has just started running`);
	}
}
