import { Message } from 'discord.js';
import { Event, Logger } from '../../src';

export default class MessageEvent extends Event<'message'> {
	public constructor() {
		super('message', {
			emitter: 'client',
			event: 'message',
		});
	}

	public exec(message: Message): void {
    Logger.warn(message.content);
  }
}
