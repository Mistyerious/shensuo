import { BaseHandler } from '.';
import { resolve } from 'path';
import { readdirSync, Dirent } from 'fs';
import { GuildMember, BitFieldResolvable, PermissionString } from 'discord.js';

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

	public static formatPermissions(member: GuildMember, permissions: BitFieldResolvable<PermissionString, bigint>[]): string {
		const result: string[] = member.permissions.missing(permissions).map((str: PermissionString): string =>
			str
				.replace(/_/g, ' ')
				.toLowerCase()
				.replace(/\b(\w)/g, (char: string): string => char.toUpperCase()),
		);

		return result.length > 1 ? `\`${result.slice(0, -1).join(', ')} and ${result.slice(-1)[0]}\`` : `\`${result[0]}\``;
	}
}
