import { randomUUID } from 'node:crypto';
import type { ServerResponse } from 'node:http';
import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Observable, fromEvent } from 'rxjs';
import { CurrentContext } from './current-context';

@Injectable()
export class CurrentContextInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<unknown> {
		const httpContext = context.switchToHttp();
		const req = httpContext.getRequest<FastifyRequest>();
		const res = httpContext.getResponse<FastifyReply>();

		req.id = randomUUID();

		this.removeUselessResponseHeaders(res.raw);

		const close$ = fromEvent(req.raw, 'close');

		return new Observable((observer) => {
			CurrentContext.run(req, res, () => {
				const contextStore = CurrentContext.getContextStore();

				close$.subscribe(() => {
					//console.debug(
					//	`[${contextStore.req.id}] Request aborted... Cleaning up context.`,
					//);
					CurrentContext.asyncLocalStorage.run(contextStore, () => {
						CurrentContext.kill();
					});
				});

				next.handle().subscribe({
					next: (value) => observer.next(value),
					error: (err) => observer.error(err),
					complete: () => observer.complete(),
				});
			});
		});
	}

	private removeUselessResponseHeaders(res: ServerResponse): void {
		for (const header of ['Date', 'Connection', 'Keep-Alive']) {
			res.removeHeader(header);
		}
	}
}
