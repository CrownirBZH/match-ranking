import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsRequired } from 'src/decorators/dto.decorator';

export class ReqAdminCreateBodyDto {
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

	@IsRequired()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: true,
		type: String,
		description: 'Admin first name',
		example: 'John',
	})
	firstname: string;

	@IsRequired()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: true,
		type: String,
		description: 'Admin last name',
		example: 'Doe',
	})
	lastname: string;
}