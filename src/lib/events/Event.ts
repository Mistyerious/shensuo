import { ClientEvents } from 'discord.js';
import { IEventOptions, IShensuoEvents } from "..";

// ! Won't import via barrel so I'm just doing it like this. Same holds true for handlers.
import { BaseModule } from "../extendable";

export abstract class Event<T extends keyof ClientEvents | keyof IShensuoEvents> extends BaseModule {
	public readonly options: IEventOptions;

	public constructor(identifier: string, { emitter, category = 'default', event, type = 'on' }: IEventOptions) {
		super(identifier, { category });

		this.options = {
			emitter,
			category,
			event,
			type
		};
	}

	public abstract exec(...args: (ClientEvents & IShensuoEvents)[T]): any;
}
