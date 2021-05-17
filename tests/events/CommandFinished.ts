import { Command, Event } from '../../src/';
import { Message } from 'discord.js';

export default class CommandFinished extends Event<'commandFinished'> {
	public constructor() {
		super('commandFinished', {
			emitter: 'commandHandler',
			event: 'commandFinished',
		});
	}

	public exec(_: Message, command: Command): void {
		this.client?.logger.info(`${command.identifier} has just finished running`);
	}
}
