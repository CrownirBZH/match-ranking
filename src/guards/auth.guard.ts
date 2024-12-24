import {
	type CanActivate,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { Admin, Player } from '@prisma/client';
import { CurrentContext } from 'src/modules/current-context';
// biome-ignore lint/style/useImportType: <explanation>
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class AuthGuard<T extends Partial<Player> | Partial<Admin>>
	implements CanActivate
{
	protected readonly authService: AuthService;

	constructor(
		authService: AuthService,
		private readonly getUserService: (id: string) => Promise<T | null>,
		private readonly missingTokenMessage: string,
		private readonly invalidTokenMessage: string,
		private readonly tokenType: string,
	) {
		this.authService = authService;
	}

	async canActivate(): Promise<boolean> {
		const headerAuthorization = CurrentContext.req.headers?.authorization;
		const accessToken = headerAuthorization
			? headerAuthorization.replace('Bearer ', '')
			: null;
		if (!accessToken)
			throw new UnauthorizedException(
				this.missingTokenMessage,
				`${this.tokenType}_TOKEN_MISSING`,
			);

		const authData =
			await this.authService.getAuthDataFromToken(accessToken);
		const user = authData ? await this.getUserService(authData.sub) : null;

		if (!user || user.deletedAt)
			throw new UnauthorizedException(
				this.invalidTokenMessage,
				`${this.tokenType}_TOKEN_INVALID`,
			);

		CurrentContext.auth = authData;

		return true;
	}
}
