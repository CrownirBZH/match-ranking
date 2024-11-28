import { Controller, NotFoundException, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidatedBody } from 'src/decorators/validation.decorator';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqAuthLoginBodyDto } from 'src/dtos/request/auth/login.body.dto';
import { ResAuthLoginDto } from 'src/dtos/response/login.dto';
import { EAccountType, EAuthMethod } from 'src/interfaces/auth.interface';
// biome-ignore lint/style/useImportType: <explanation>
import { AdminAuthService } from 'src/services/admin/auth.service';
// biome-ignore lint/style/useImportType: <explanation>
import { AuthService } from 'src/services/auth.service';

@ApiTags('Admin/Auth')
@Controller('admin/auth')
export class AdminAuthController {
	constructor(
		private readonly adminAuthService: AdminAuthService,
		private readonly authService: AuthService,
	) {}

	@Post('login')
	@ApiOperation({
		summary: 'Admin login',
		description: 'Admin login using username / password.',
	})
	@ApiResponse({
		status: 201,
		description: 'The login was succesfull',
		type: ResAuthLoginDto,
	})
	@ApiResponse({
		status: 404,
		description: 'The admin user was not found or the password is invalid',
	})
	async login(
		@ValidatedBody() body: ReqAuthLoginBodyDto,
	): Promise<ResAuthLoginDto> {
		const checkPasswordData =
			await this.adminAuthService.getAdminCheckPasswordData(
				body.username,
			);

		if (
			!checkPasswordData ||
			!(await this.authService.checkPassword(
				body.password,
				checkPasswordData.password,
			))
		)
			throw new NotFoundException(
				'The admin user was not found or the password is invalid',
				'ADMIN_USER_NOT_FOUND',
			);

		const token = await this.authService.generateAccessToken(
			checkPasswordData.id,
			EAccountType.ADMIN,
			EAuthMethod.PASSWORD,
		);

		return { access_token: token };
	}
}
