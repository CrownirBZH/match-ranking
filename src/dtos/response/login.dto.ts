import { ApiProperty } from '@nestjs/swagger';

export class ResAuthLoginDto {
	@ApiProperty({
		required: true,
		type: String,
		description: 'Access token',
		example: 'ey...',
	})
	access_token: string;
}
