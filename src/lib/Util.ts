import { BaseHandler } from '.';
import { resolve } from 'path';
import { readdirSync, Dirent } from 'fs';

export class Util {
	public static logIfActivated(method: Function, handler: BaseHandler, ...args: unknown[]): void {
		if (handler.options.logging) method(...args);
	}

	public static isClass(target: unknown): boolean {
		return typeof target === 'function';
	}

	public static isPromise(target: unknown): boolean {
		return target instanceof Promise && typeof target.then === 'function' && typeof target.catch === 'function';
	}

	public static glob(directory: string, matches: string[] = []): string[] {
		readdirSync(directory, { withFileTypes: true }).forEach(async (dirent: Dirent): Promise<void> => void (dirent.isDirectory() ? this.glob(resolve(directory, dirent.name), matches) : matches.push(resolve(directory, dirent.name))));
		return matches;
	}
}
