import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { CurrentContextModule } from './modules/current-context';
import { PrismaModule } from './modules/prisma';

// Controllers
import { AppController } from './app.controller';

import { AdminController } from './controllers/admin/admin.controller';
import { AdminAuthController } from './controllers/admin/auth.controller';
import { AdminGroupsController } from './controllers/admin/groups.controller';
import { AdminPlayersController } from './controllers/admin/players.controller';

import { PlayersAuthController } from './controllers/players/auth.controller';
import { PlayersController } from './controllers/players/players.controller';

// Services
import { AuthService } from './services/auth.service';
import { SwaggerService } from './services/swagger.service';
import { Axios } from './utils/axios';

import { AdminService } from './services/admin/admin.service';
import { AdminAuthService } from './services/admin/auth.service';
import { AdminGroupsService } from './services/admin/groups.service';
import { AdminPlayersService } from './services/admin/players.service';

import { GroupsService } from './services/groups.service';
import { PlayersAuthService } from './services/players/auth.service';
import { PlayersService } from './services/players/players.service';

const adminControllers = [
	AdminController,
	AdminAuthController,
	AdminPlayersController,
	AdminGroupsController,
];
const playersControllers = [PlayersController, PlayersAuthController];

const adminServices = [
	AdminService,
	AdminAuthService,
	AdminPlayersService,
	AdminGroupsService,
];
const playersServices = [PlayersService, PlayersAuthService, GroupsService];

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		CurrentContextModule,
		PrismaModule,
	],
	controllers: [AppController, ...adminControllers, ...playersControllers],
	providers: [
		SwaggerService,
		Axios,
		AuthService,
		...adminServices,
		...playersServices,
	],
})
export class AppModule {}
