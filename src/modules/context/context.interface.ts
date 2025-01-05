import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IAuthDataToken } from 'src/interfaces/auth.interface';

export interface IContextData {
	req: FastifyRequest;
	res: FastifyReply;
	auth?: IAuthDataToken;
}
