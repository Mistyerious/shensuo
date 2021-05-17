import { Event } from '../../src';

export default class ReadyEvent extends Event<'ready'> {
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			type: 'once'
		});
	}

	public async exec(): Promise<void> {
		this.client?.logger.success(`${this.client?.user?.tag} is now online.`);
	}
}
