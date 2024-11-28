import { NestFactory } from '@nestjs/core';
// biome-ignore lint/style/useImportType: <explanation>
import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as bcrypt from 'bcryptjs';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/modules/prisma';

const { PASSWORD_SALT_ROUNDS = '10' } = process.env;

(async () => {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);

	const prismaService = app.get(PrismaService);

	const password = 'Test1234!';

	const hashedSaltedPassword = await bcrypt.hash(
		password,
		Number(PASSWORD_SALT_ROUNDS),
	);

	await prismaService.admin.create({
		data: {
			username: 'admin',
			password: hashedSaltedPassword,
			firstname: 'John',
			lastname: 'Doe',
		},
	});
})();
