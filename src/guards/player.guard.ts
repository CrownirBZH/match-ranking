import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { Player } from '@prisma/client';
// biome-ignore lint/style/useImportType: <explanation>
import { AuthService } from 'src/services/auth.service';
// biome-ignore lint/style/useImportType: <explanation>
import { PlayersService } from 'src/services/players/players.service';
import { AuthGuard } from './auth.guard';

@Injectable()
export class PlayerGuard extends AuthGuard<Partial<Player>> {
	constructor(
		protected readonly playersService: PlayersService,
		protected readonly authService: AuthService,
	) {
		super(
			authService,
			(id: string) => playersService.getPlayerById(id),
			'Player token is missing',
			'Player token is invalid',
			'PLAYER',
		);
	}
}
