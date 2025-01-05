import {
	type MiddlewareConsumer,
	Module,
	type NestModule,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentContextInterceptor } from './context.interceptor';
import { CurrentContextMiddleware } from './context.middleware';

@Module({
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: CurrentContextInterceptor,
		},
	],
})
export class CurrentContextModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CurrentContextMiddleware).forRoutes('*');
	}
}
