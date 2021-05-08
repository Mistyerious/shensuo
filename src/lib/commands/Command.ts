import { Message } from 'discord.js';
import { ICommandOptions } from '..';

// ! Won't import via barrel so I'm just doing it like this. Same holds true for handlers.
import { BaseModule } from '../extendable/BaseModule';

export abstract class Command extends BaseModule {
	public constructor(identifier: string, public readonly options: ICommandOptions) {
		super(identifier, { category: options.category ?? 'default' });
	}

	public abstract exec(message: Message, args: unknown): any;
}
