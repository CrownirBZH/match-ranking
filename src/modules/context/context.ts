import { AsyncLocalStorage } from 'node:async_hooks';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IAuthDataToken } from 'src/interfaces/auth.interface';
import type { ICurrentContextData } from './context.interface';

export class Context {
	public static asyncLocalStorage =
		new AsyncLocalStorage<ICurrentContextData>();

	static get req(): FastifyRequest {
		const context = Context.asyncLocalStorage.getStore();
		return context?.req;
	}

	static get res(): FastifyReply {
		const context = Context.asyncLocalStorage.getStore();
		return context?.res;
	}

	static get auth(): IAuthDataToken {
		const context = Context.asyncLocalStorage.getStore();
		return context?.auth;
	}

	static set req(value: FastifyRequest) {
		const context = Context.asyncLocalStorage.getStore();
		if (context) context.req = value;
	}

	static set res(value: FastifyReply) {
		const context = Context.asyncLocalStorage.getStore();
		if (context) context.res = value;
	}

	static set auth(value: IAuthDataToken) {
		const context = Context.asyncLocalStorage.getStore();
		if (context) context.auth = value;
	}

	static run(
		req: FastifyRequest,
		res: FastifyReply,
		callback: () => void,
	): void {
		Context.asyncLocalStorage.run(
			{
				req,
				res,
			},
			callback,
		);
	}
}
