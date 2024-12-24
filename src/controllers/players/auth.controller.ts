import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidatedBody } from 'src/decorators/validation.decorator';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqAuthLoginBodyDto } from 'src/dtos/request/auth/login.body.dto';
import { ResAuthLoginDto } from 'src/dtos/response/login.dto';
import { EAccountType } from 'src/interfaces/auth.interface';
// biome-ignore lint/style/useImportType: <explanation>
import { AuthService } from 'src/services/auth.service';
// biome-ignore lint/style/useImportType: <explanation>
import { PlayersAuthService } from 'src/services/players/auth.service';

@ApiTags('Players/Auth')
@Controller('players/auth')
export class PlayersAuthController {
	constructor(
		private readonly playersAuthService: PlayersAuthService,
		private readonly authService: AuthService,
	) {}

	@Post('login')
	@ApiOperation({
		summary: 'Player login',
		description: 'Player login using username / password.',
	})
	@ApiResponse({
		status: 201,
		description: 'The login was succesfull',
		type: ResAuthLoginDto,
	})
	@ApiResponse({
		status: 404,
		description: 'The player was not found or the password is invalid',
	})
	async login(
		@ValidatedBody() body: ReqAuthLoginBodyDto,
	): Promise<ResAuthLoginDto> {
		const checkPasswordData =
			await this.playersAuthService.getPlayerCheckPasswordData(
				body.username,
			);

		return await this.authService.passwordLoginOrFail(
			body.password,
			checkPasswordData,
			EAccountType.PLAYER,
		);
	}
}
