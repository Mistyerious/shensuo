import { ILogTypes, LogTypes } from '.';
import { EOL } from 'os';

export class Logger {
	protected _checkpoints = 0;

	protected static readonly _symbols: ILogTypes = { info: 'ℹ', success: '✔', warn: '⚠', error: '✖', checkpoint: 'ℹ' };
	protected static readonly _colours = {
		info: [143, 188, 187],
		checkpoint: [143, 188, 187],
		success: [161, 188, 138],
		error: [191, 97, 106],
		warn: [235, 203, 139],
		foreground: [139, 132, 121],
	};

	protected static _rgb([r, g, b]: number[], ...args: unknown[]): string {
		return `\x1b[38;2;${r};${g};${b}m${args.join(' ')}\x1b[0m`;
	}

	protected static write(colour: number[], level: LogTypes, ...message: unknown[]): typeof Logger {
		process.stdout.write(
			`${Logger._rgb(Logger._colours[level], Logger._symbols[level])} ${Logger._rgb(Logger._colours.foreground, new Date().toLocaleString())} ${Logger._rgb(colour, level.toUpperCase())} (shensuo) ${Logger._rgb(
				colour,
				message,
			)}${EOL}`,
		);

		return Logger;
	}

	public static info(...message: string[]): typeof Logger {
		return Logger.write(Logger._colours.info, 'info', message);
	}

	public static success(...message: string[]): typeof Logger {
		return Logger.write(Logger._colours.success, 'success', message);
	}

	public static error(...message: string[]): typeof Logger {
		return Logger.write(Logger._colours.error, 'error', message);
	}

	public static exit(code = 0, ...message: string[]): void {
		Logger.write(Logger._colours.error, 'error', `${message} ( exit with code ${code})`);
		process.exit(code);
	}

	public static warn(...message: string[]): typeof Logger {
		return Logger.write(Logger._colours.warn, 'warn', message);
	}

	public checkpoint(): typeof Logger {
		Logger.write(Logger._colours.info, 'info', `Checkpoint ${this._checkpoints} reached.`);
		this._checkpoints++;
		return Logger;
	}
}
