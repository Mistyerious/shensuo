import { EventEmitter } from 'events';
import { IBaseHandlerOptions, Logger, BaseModule, Util, EVENTS, ShensuoClient } from '..';
import { statSync } from 'fs';
import { extname, resolve } from 'path';
import { Collection, Constructable } from 'discord.js';

export abstract class BaseHandler extends EventEmitter {
	public readonly modules: Collection<string, BaseModule> = new Collection();
	public readonly categories: string[] = [];

	public constructor(
		public readonly client: ShensuoClient,
		public readonly options: IBaseHandlerOptions = {
			logging: true,
			directory: 'Provide a directory dummy',
			extensions: ['.js', '.ts'],
		},
	) {
		super();

		if (!statSync(this.options.directory).isDirectory()) Logger.exit(1, 'Specified directory does not exist.');
	}

	public register(module: BaseModule, path?: string): void {
		module.path = path;
		module.client = this.client;
		module.handler = this;

		this.modules.set(module.identifier, module);

		if (!this.categories.some((category: string): boolean => category === module.category)) this.categories.push(module.category);

		Util.logIfActivated(Logger.info, this, `Registered ${module.identifier}.`);
	}

	public deregister(module: BaseModule): void {
		if (module.path) delete require.cache[require.resolve(module.path)];
		this.modules.delete(module.identifier);

		Util.logIfActivated(Logger.info, this, `Deregistered ${module.identifier}.`);
	}

	public async load(moduleOrPath: BaseModule | string, isReload = false): Promise<BaseModule | undefined> {
		const isClass = Util.isClass(moduleOrPath);

		if (!isClass && !this.options.extensions?.includes(extname(moduleOrPath as string))) {
			Util.logIfActivated(Logger.error, this, `Couldn't load ${isClass ? (moduleOrPath as BaseModule).identifier : moduleOrPath}`);
			return;
		}

		const newMod: Constructable<BaseModule> = isClass ? moduleOrPath : (await import(moduleOrPath as string)).default;
		let mod: BaseModule;

		if (newMod) mod = new newMod(this);
		else {
			if (isClass) delete require.cache[require.resolve(moduleOrPath as string)];
			return;
		}

		if (this.modules.has(mod.identifier)) Logger.exit(1, `Module ${mod.identifier} is already loaded!`);

		this.register(mod, isClass ? undefined : (moduleOrPath as string));
		this.emit(EVENTS.BASE_HANDLER.LOAD, mod, isReload);

		return mod;
	}

	public async loadAll(directory: string | undefined = this.options.directory): Promise<this> {
		for (let filepath of Util.glob(directory)) {
			filepath = resolve(filepath);
			await this.load(filepath);
		}

		return this;
	}

	public remove(identifier: string): BaseModule | undefined {
		const mod = this.modules.get(identifier);

		if (!mod) {
			Logger.exit(1, `${this.constructor.name} '${identifier}' not found.`);
			return;
		}

		this.deregister(mod);
		this.emit(EVENTS.BASE_HANDLER.REMOVE, mod);

		return mod;
	}

	public removeAll(): this {
		for (const m of this.modules.array()) if (m.path) this.remove(m.identifier);
		return this;
	}

	public async reload(identifier: string): Promise<BaseModule | undefined> {
		const mod = this.modules.get(identifier);

		if (!mod) {
			Logger.exit(1, `${this.constructor.name} '${identifier}' not found.`);
			return;
		}
		if (!mod.path) {
			Logger.exit(1, `${this.constructor.name} '${identifier}' cannot be reloaded as no path was provided.`);
			return;
		}

		this.deregister(mod);
		return await this.load(mod.path, true);
	}

	public reloadAll(): this {
		for (const m of this.modules.array()) if (m.path) this.reload(m.identifier);
		return this;
	}
}
