import * as path from 'node:path';
import fastifyCookie from '@fastify/cookie';
import fastifyStatic from '@fastify/static';
import { NestFactory } from '@nestjs/core';
import {
	FastifyAdapter,
	type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SwaggerService } from './services/swagger.service';

const { PORT = 3000 } = process.env;

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);

	// Generate Swagger documentation
	SwaggerService.setup(app);

	// Register plugins
	app.register(fastifyStatic, {
		root: path.join(__dirname, '../public'),
	});
	app.register(fastifyCookie);

	// Start the server
	await app.listen(PORT, '0.0.0.0');
}

bootstrap();

process.on('unhandledRejection', (reason: unknown) => {
	console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
	console.error('Uncaught Exception:', error);
});
