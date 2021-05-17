import { Message } from 'discord.js';
import { Event } from '../../src';

export default class MessageEvent extends Event<'message'> {
	public constructor() {
		super('message', {
			emitter: 'client',
			event: 'message',
		});
	}

	public exec(message: Message): void {
		this.client?.logger.info(`A message was sent by ${message.author.id}`);
	}
}
