import { ClientOptions, Intents } from 'discord.js';
import { resolve } from 'path';
import { ShensuoClient, Logger, CommandHandler, IShensuoClientOptions, EventHandler } from '../src';
import { token, prefix } from './config.json';

class TestingBot extends ShensuoClient {
	public constructor(public readonly _options: IShensuoClientOptions & ClientOptions) {
		super(_options);
	}

	public readonly commandHandler: CommandHandler = new CommandHandler(this, {
		prefix,
		directory: resolve(__dirname, 'commands'),
		logging: true,
	});

	public readonly eventHandler: EventHandler = new EventHandler(this, {
		directory: resolve(__dirname, 'events'),
	});

	public async start(): Promise<this> {
		await this.commandHandler.loadAll();

		this.eventHandler.setEmitters({
			'client': this,
		})

		await this.eventHandler.loadAll();

		this.once('ready', () => {
			Logger.success(`${this.user?.tag} is now online!`);
		});

		await super.login(this._options.token);

		return this;
	}
}

new TestingBot({
	token,
	intents: Intents.ALL,
	partials: ['CHANNEL'],
}).start();
