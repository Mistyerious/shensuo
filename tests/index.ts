import { ClientOptions, Intents } from 'discord.js';
import { resolve } from 'path';
import { ShensuoClient, Logger, CommandHandler, IShensuoClientOptions, EventHandler } from '../src';
import { token, prefix } from './config.json';

declare module '../src/lib/extendable/ShensuoClient' {
	interface ShensuoClient {
		logger: typeof Logger;
	}
}

class TestingBot extends ShensuoClient {
	public readonly logger: typeof Logger = Logger;

	public constructor(public readonly _options: IShensuoClientOptions & ClientOptions) {
		super(_options);
	}

	public readonly commandHandler: CommandHandler = new CommandHandler(this, {
		prefix,
		directory: resolve(__dirname, 'commands'),
		logging: true,
		allowMention: true,
		handleEdits: true,
	});

	public readonly eventHandler: EventHandler = new EventHandler(this, {
		directory: resolve(__dirname, 'events'),
		logging: true,
		
	});

	public async start(): Promise<this> {
		await this.commandHandler.loadAll();

		this.eventHandler.setEmitters({
			client: this,
			commandHandler: this.commandHandler,
		});

		await this.eventHandler.loadAll();
		await super.login(this._options.token);

		return this;
	}
}

new TestingBot({
	token,
	intents: Intents.NON_PRIVILEGED,
	partials: ['CHANNEL'],
}).start();
