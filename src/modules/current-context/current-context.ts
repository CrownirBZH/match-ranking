import { AsyncLocalStorage } from 'node:async_hooks';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IAuthDataToken } from 'src/interfaces/auth.interface';
import type { ICurrentContextData } from './current-context.interface';

export class CurrentContext {
	public static asyncLocalStorage =
		new AsyncLocalStorage<ICurrentContextData>();

	static get req(): FastifyRequest {
		const context = CurrentContext.asyncLocalStorage.getStore();
		return context?.req;
	}

	static get res(): FastifyReply {
		const context = CurrentContext.asyncLocalStorage.getStore();
		return context?.res;
	}

	static get auth(): IAuthDataToken {
		const context = CurrentContext.asyncLocalStorage.getStore();
		return context?.auth;
	}

	static set req(value: FastifyRequest) {
		const context = CurrentContext.asyncLocalStorage.getStore();
		if (context) context.req = value;
	}

	static set res(value: FastifyReply) {
		const context = CurrentContext.asyncLocalStorage.getStore();
		if (context) context.res = value;
	}

	static set auth(value: IAuthDataToken) {
		const context = CurrentContext.asyncLocalStorage.getStore();
		if (context) context.auth = value;
	}

	static run(
		req: FastifyRequest,
		res: FastifyReply,
		callback: () => void,
	): void {
		CurrentContext.asyncLocalStorage.run(
			{
				req,
				res,
			},
			callback,
		);
	}
}
