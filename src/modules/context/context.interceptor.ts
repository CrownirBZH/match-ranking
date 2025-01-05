import type { ServerResponse } from 'node:http';
import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Context } from './context';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler) {
		const httpContext = context.switchToHttp();
		const req = httpContext.getRequest<FastifyRequest>();
		const res = httpContext.getResponse<FastifyReply>();

		req.id = Context.req.id;

		this.removeUselessResponseHeaders(res.raw);

		Context.req = req;
		Context.res = res;

		return next.handle();
	}

	private removeUselessResponseHeaders(res: ServerResponse): void {
		for (const header of ['Date', 'Connection', 'Keep-Alive']) {
			res.removeHeader(header);
		}
	}
}
