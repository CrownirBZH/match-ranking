import {
	type CanActivate,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { CurrentContext } from 'src/modules/current-context';
// biome-ignore lint/style/useImportType: <explanation>
import { AdminService } from 'src/services/admin/admin.service';
// biome-ignore lint/style/useImportType: <explanation>
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(
		private readonly adminService: AdminService,
		private readonly authService: AuthService,
	) {}

	async canActivate(): Promise<boolean> {
		const headerAuthorization = CurrentContext.req.headers?.authorization;
		const accessToken = headerAuthorization
			? headerAuthorization.replace('Bearer ', '')
			: null;
		if (!accessToken)
			throw new UnauthorizedException(
				'Admin token is missing',
				'ADMIN_TOKEN_MISSING',
			);

		const adminAuthDataToken =
			await this.authService.getAuthDataFromToken(accessToken);
		const admin = adminAuthDataToken
			? await this.adminService.getAdminById(adminAuthDataToken.sub)
			: null;

		if (!adminAuthDataToken || !admin || admin.deletedAt)
			throw new UnauthorizedException(
				'Admin token is invalid',
				'ADMIN_TOKEN_INVALID',
			);

		CurrentContext.auth = adminAuthDataToken;

		return true;
	}
}
