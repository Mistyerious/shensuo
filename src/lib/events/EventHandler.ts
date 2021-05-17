import { Collection } from 'discord.js';
import { default as EventEmitter } from 'events';
import { IEventHandlerOptions, ShensuoClient, Logger, Util, Event, UnionEvents } from '..';
import { BaseHandler } from '../extendable';

export class EventHandler extends BaseHandler<any> {
	public readonly emitters: Collection<string, EventEmitter> = new Collection();
	public readonly modules: Collection<string, Event<any>> = new Collection();
	protected readonly _options: IEventHandlerOptions;

	public constructor(public readonly client: ShensuoClient, { extensions = ['.js', '.ts'], logging = true, directory }: IEventHandlerOptions) {
		super(client, {
			extensions,
			directory,
			logging,
		});

		this._options = {
			extensions,
			logging,
			directory,
		};
	}

	public register<T extends UnionEvents>(event: Event<T>, path: string): Event<T> {
		super.register(event, path);
		//@ts-ignore maybe in the future I'll be arsed to fix it
		event.exec = event.exec.bind(event);
		this.addToEmitter(event.identifier);
		return event;
	}

	public deregister(event: Event<any>): void {
		this.removeFromEmitter(event.identifier);
		super.deregister(event);
	}

	public addToEmitter<T extends UnionEvents>(identifier: string): Event<T> | void {
		const listener: Event<T> | undefined = this.modules.get(identifier);
		if (!listener) return Logger.exit(1, `'Event' '${identifier}' not found.`);

		const emitter: string | EventEmitter | undefined = Util.isEventEmitter(listener.options) ? listener.options.emitter : this.emitters.get(listener.options.emitter.toString());
		if (!Util.isEventEmitter(emitter)) return Logger.exit(1, `'Emitter' '${identifier}' is not an emitter.`);

		(emitter as EventEmitter)[listener.options.type!](listener.options.event, listener.exec as any);

		return listener;
	}

	public removeFromEmitter<T extends UnionEvents>(identifier: string): Event<T> | void {
		const listener: Event<T> | undefined = this.modules.get(identifier.toString());
		if (!listener) return Logger.exit(1, `'Event' '${identifier}' not found.`);

		const emitter: string | EventEmitter | undefined = Util.isEventEmitter(listener.options.emitter) ? listener.options.emitter : this.emitters.get(listener.options.emitter.toString());
		if (!Util.isEventEmitter(emitter)) return Logger.exit(1, `'Event' '${identifier}' is not an event.`);

		(emitter as EventEmitter).removeListener(listener.options.event, listener.exec as any);

		return listener;
	}

	public setEmitters(emitters: Record<string, EventEmitter>): void | this {
		for (const [key, value] of Object.entries(emitters)) {
			if (!Util.isEventEmitter(value)) return Logger.exit(1, 'Invalid emitter set.');
			this.emitters.set(key, value);
		}

		return this;
	}
}
