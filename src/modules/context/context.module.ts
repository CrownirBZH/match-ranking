import {
	type MiddlewareConsumer,
	Module,
	type NestModule,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContextInterceptor } from './context.interceptor';
import { ContextMiddleware } from './context.middleware';

@Module({
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: ContextInterceptor,
		},
	],
})
export class CurrentContextModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(ContextMiddleware).forRoutes('*');
	}
}
