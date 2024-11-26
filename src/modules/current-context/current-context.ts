import { AsyncLocalStorage } from 'node:async_hooks';
import type { FastifyReply, FastifyRequest } from 'fastify';

interface CurrentContextData {
	req: FastifyRequest;
	res: FastifyReply;
	abortControllers: Map<string, AbortController>;
	active: boolean;
}

export class CurrentContext {
	public static asyncLocalStorage =
		new AsyncLocalStorage<CurrentContextData>();

	static get req(): FastifyRequest | undefined {
		const context = CurrentContext.asyncLocalStorage.getStore();
		return context?.req;
	}

	static get res(): FastifyReply | undefined {
		const context = CurrentContext.asyncLocalStorage.getStore();
		return context?.res;
	}

	static get active(): boolean {
		const context = CurrentContext.asyncLocalStorage.getStore();
		return context?.active ?? false;
	}

	static getContextStore(): CurrentContextData | undefined {
		return CurrentContext.asyncLocalStorage.getStore();
	}

	static addRequest(
		requestId: string,
		abortController: AbortController,
	): void {
		const context = CurrentContext.asyncLocalStorage.getStore();
		if (context) context.abortControllers.set(requestId, abortController);
	}

	static removeRequest(requestId: string): void {
		const context = CurrentContext.asyncLocalStorage.getStore();
		if (context) context.abortControllers.delete(requestId);
	}

	static kill(): void {
		CurrentContext.abortRequests();

		const context = CurrentContext.asyncLocalStorage.getStore();
		if (context) context.active = false;
	}

	static async abortRequests(): Promise<void> {
		const context = CurrentContext.asyncLocalStorage.getStore();
		if (context) {
			for (const [
				requestId,
				controller,
			] of context.abortControllers.entries()) {
				controller.abort();
				CurrentContext.removeRequest(requestId);
			}
		}
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
				abortControllers: new Map<string, AbortController>(),
				active: true,
			},
			callback,
		);
	}
}
