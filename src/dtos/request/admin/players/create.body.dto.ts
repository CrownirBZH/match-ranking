import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsRequired } from 'src/decorators/dto.decorator';

export class ReqAdminPlayerCreateBodyDto {
	@IsRequired()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: true,
		type: String,
		description: 'Player username',
		example: 'player',
	})
	username: string;

	@IsRequired()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: true,
		type: String,
		description: 'Player password',
		example: 'Test1234!',
	})
	password: string;

	@IsRequired()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: true,
		type: String,
		description: 'Player first name',
		example: 'John',
	})
	firstname: string;

	@IsRequired()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: true,
		type: String,
		description: 'Player last name',
		example: 'Doe',
	})
	lastname: string;
}
