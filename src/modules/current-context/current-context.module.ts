import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentContextInterceptor } from './current-context.interceptor';

@Module({
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: CurrentContextInterceptor,
		},
	],
})
export class RequestContextModule {}
