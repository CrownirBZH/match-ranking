import {
	Injectable,
	Logger,
	type OnModuleDestroy,
	type OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(this.constructor.name);

	async onModuleDestroy() {
		await this.$disconnect();
		this.logger.log('Prisma client disconnected');
	}

	async onModuleInit() {
		await this.$connect();
		this.logger.log('Prisma client connected');
	}
}
