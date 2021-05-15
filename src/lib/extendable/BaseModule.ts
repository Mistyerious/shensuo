import { BaseHandler, ShensuoClient, IBaseModuleOptions } from '..';

export abstract class BaseModule {
	public path?: string;
	public client?: ShensuoClient;
	public handler?: BaseHandler<any>;
	public readonly category: string;

	public constructor(public readonly identifier: string, options: IBaseModuleOptions) {
		this.category = options.category;
	}
}
