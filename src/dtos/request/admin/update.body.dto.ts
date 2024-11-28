import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsNull, IsOptional } from 'src/decorators/dto.decorator';

export class ReqAdminUpdateBodyDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: false,
		type: String,
		description: 'Admin username',
		example: 'admin',
	})
	username?: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: false,
		type: String,
		description: 'Admin password',
		example: 'Test1234!',
	})
	password?: string;

	@IsOptional()
	@IsNull()
	@ApiProperty({
		required: false,
		type: 'null',
		description: 'Remove linked Sésame account',
		example: null,
	})
	sesame?: null;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: false,
		type: String,
		description: 'Admin first name',
		example: 'John',
	})
	firstname?: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: false,
		type: String,
		description: 'Admin last name',
		example: 'Doe',
	})
	lastname?: string;
}
