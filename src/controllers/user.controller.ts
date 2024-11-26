import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidatedQuery } from 'src/decorators/validation.decorator';
// biome-ignore lint/style/useImportType: <explanation>
import { UserQueryDto } from 'src/dtos/user.query';
// biome-ignore lint/style/useImportType: <explanation>
import { UserService } from 'src/services/user.service';
import { Axios } from 'src/utils/axios';

@ApiTags('User')
@Controller('user')
export class UserController {
	private axios = Axios.create();

	constructor(private readonly userService: UserService) {}

	@Get()
	@ApiOperation({
		summary: 'Get user greetings',
		description:
			'Returns a greeting message based on the query parameters.',
	})
	@ApiResponse({ status: 200, description: 'Successful greeting message.' })
	@ApiResponse({ status: 400, description: 'Invalid query parameters.' })
	async test(@ValidatedQuery() query: UserQueryDto): Promise<string> {
		const parisDate = query.dob.setZone('Europe/Paris');
		console.debug('UTC:', query.dob.toISO());
		console.debug('Europe/Paris:', parisDate.toISO());
		console.debug();

		return await this.userService.greetings(query);
	}
}
