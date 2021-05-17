import { Event, Logger } from '../../src';

export default class ReadyEvent extends Event<'ready'> {
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
		});
	}

	public exec(): void {
		Logger.success(`${this.client?.user?.tag} is now online.`);
	}
}
