import { Client, ClientOptions } from 'discord.js';
import { IShensuoClientOptions } from '..';

export class ShensuoClient extends Client {
	public constructor(options: IShensuoClientOptions & ClientOptions) {
		super(options);
	}
}
