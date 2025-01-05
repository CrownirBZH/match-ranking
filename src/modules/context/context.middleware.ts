import { randomUUID } from 'node:crypto';
import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Context } from './context';

@Injectable()
export class CurrentContextMiddleware implements NestMiddleware {
	use(req: FastifyRequest, res: FastifyReply, next: () => void): void {
		req.id = randomUUID();

		Context.run(req, res, () => {
			next();
		});
	}
}
