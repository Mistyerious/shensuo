import { ClientOptions, Intents } from 'discord.js';
import { resolve } from 'path';
import { ShensuoClient, Logger, CommandHandler, IShensuoClientOptions, EVENTS } from '../src';
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

	public async start(): Promise<this> {
		await this.commandHandler.loadAll();

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
}).start();
