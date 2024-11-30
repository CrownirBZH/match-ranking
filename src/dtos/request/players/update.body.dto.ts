import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsOptional } from 'src/decorators/dto.decorator';

export class ReqPlayerUpdateBodyDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: false,
		type: String,
		description: 'Player username',
		example: 'player',
	})
	username?: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: false,
		type: String,
		description: 'Player password',
		example: 'Test1234!',
	})
	password?: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: false,
		type: String,
		description: 'Player first name',
		example: 'John',
	})
	firstname?: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: false,
		type: String,
		description: 'Player last name',
		example: 'Doe',
	})
	lastname?: string;
}
