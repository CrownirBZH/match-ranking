import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsRequired } from 'src/decorators/dto.decorator';

export class ReqAuthLoginBodyDto {
	@IsRequired()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: true,
		type: String,
		description: 'Admin username',
		example: 'admin',
	})
	username: string;

	@IsRequired()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: true,
		type: String,
		description: 'Admin password',
		example: 'Test1234!',
	})
	password: string;

	@IsOptional()
	grant_type?: string;
}
