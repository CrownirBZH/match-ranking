import {
	type CanActivate,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { CurrentContext } from 'src/modules/current-context';
// biome-ignore lint/style/useImportType: <explanation>
import { AuthService } from 'src/services/auth.service';
// biome-ignore lint/style/useImportType: <explanation>
import { PlayersService } from 'src/services/players/players.service';

@Injectable()
export class PlayerGuard implements CanActivate {
	constructor(
		private readonly playersService: PlayersService,
		private readonly authService: AuthService,
	) {}

	async canActivate(): Promise<boolean> {
		const headerAuthorization = CurrentContext.req.headers?.authorization;
		const accessToken = headerAuthorization
			? headerAuthorization.replace('Bearer ', '')
			: null;
		if (!accessToken)
			throw new UnauthorizedException(
				'Player token is missing',
				'PLAYER_TOKEN_MISSING',
			);

		const playerAuthDataToken =
			await this.authService.getAuthDataFromToken(accessToken);
		const player = playerAuthDataToken
			? await this.playersService.getPlayerById(playerAuthDataToken.sub)
			: null;

		if (!playerAuthDataToken || !player || player.deletedAt)
			throw new UnauthorizedException(
				'Player token is invalid',
				'PLAYER_TOKEN_INVALID',
			);

		CurrentContext.auth = playerAuthDataToken;

		return true;
	}
}
