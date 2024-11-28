import { randomUUID } from 'node:crypto';
import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { CurrentContext } from './current-context';

@Injectable()
export class CurrentContextMiddleware implements NestMiddleware {
	use(req: FastifyRequest, res: FastifyReply, next: () => void): void {
		req.id = randomUUID();

		CurrentContext.run(req, res, () => {
			next();
		});
	}
}
