import { Client, ClientApplication, ClientOptions, Team } from 'discord.js';
import { IShensuoClientOptions } from '..';

export class ShensuoClient extends Client {
	public constructor(public readonly _options: ClientOptions & IShensuoClientOptions) {
		super(_options);
	}

	public async start(): Promise<this> {
		this.once('ready', async (): Promise<void> => {
			const application: ClientApplication | undefined = await this.application?.fetch();

			if (!this._options.owners) {
				this._options.owners = [];

				if (application?.owner instanceof Team) {
					for (const member of application.owner.members.array()) this._options.owners.push(member.id);
				} else {
					if (!application?.owner) await application?.owner?.fetch();
					this._options.owners.push(application?.owner?.id!);
				}
			}
		});

		return this;
	}
}
