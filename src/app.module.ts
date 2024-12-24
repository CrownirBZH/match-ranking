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
import { EventsService } from './services/events.service';
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
	AdminGroupsController,
	AdminPlayersController,
];
const playersControllers = [PlayersController, PlayersAuthController];

const adminServices = [
	AdminService,
	AdminAuthService,
	AdminGroupsService,
	AdminPlayersService,
];
const playersServices = [GroupsService, PlayersAuthService, PlayersService];

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
		AuthService,
		EventsService,
		SwaggerService,
		Axios,
		...adminServices,
		...playersServices,
	],
})
export class AppModule {}
