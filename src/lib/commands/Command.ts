import { Message } from 'discord.js';
import { ICommandOptions } from '..';

// ! Won't import via barrel so I'm just doing it like this. Same holds true for handlers.
import { BaseModule } from '../extendable';

export abstract class Command extends BaseModule {
	public readonly options: ICommandOptions;

	public constructor(identifier: string, { aliases = [], clientPermissions = [], description = {}, ownerOnly = false, userPermissions = [], category = 'default', channel = 'guild' }: ICommandOptions) {
		super(identifier, { category });

		this.options = {
			aliases,
			clientPermissions,
			description,
			ownerOnly,
			userPermissions,
			category,
			channel,
		};
	}

	public abstract exec(message: Message, args: unknown): any;
}
