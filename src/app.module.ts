import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { RequestContextModule } from './modules/current-context';
//import { PrismaModule } from './modules/prisma';

import { AppController } from './app.controller';
import { UserController } from './controllers/user.controller';

import { SwaggerService } from './services/swagger.service';
import { UserService } from './services/user.service';
import { Axios } from './utils/axios';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		RequestContextModule,
		//PrismaModule,
	],
	controllers: [AppController, UserController],
	providers: [SwaggerService, Axios, UserService],
})
export class AppModule {}
