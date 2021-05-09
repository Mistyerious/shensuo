import { Client, ClientOptions } from 'discord.js';
import { IShensuoClientOptions } from '..';

export class ShensuoClient extends Client {
	public constructor(public readonly _options: ClientOptions & IShensuoClientOptions) {
		super(_options);
	}
}
