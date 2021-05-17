import { IEventOptions, UnionEvents } from '..';

// ! Won't import via barrel so I'm just doing it like this. Same holds true for handlers.
import { BaseModule } from '../extendable';
import { IntersectedEvents } from '../Types';

export abstract class Event<T extends UnionEvents> extends BaseModule {
	public readonly options: IEventOptions;

	public constructor(identifier: string, { emitter, category = 'default', event, type = 'on' }: IEventOptions) {
		super(identifier, { category });

		this.options = {
			emitter,
			category,
			event,
			type,
		};
	}

	public abstract exec(...args: IntersectedEvents[T]): any;
}
