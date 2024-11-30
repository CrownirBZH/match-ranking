import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsNullable, IsRequired } from 'src/decorators/dto.decorator';

export class ReqAdminGroupCreateBodyDto {
	@IsRequired()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: true,
		type: String,
		description: 'Group name',
		example: 'group',
	})
	name: string;

	@IsOptional()
	@IsNullable()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: false,
		type: String,
		description: 'Group description',
		example: 'Lorem ipsum...',
	})
	description?: string;

	@IsRequired()
	@IsString({ each: true })
	@ApiProperty({
		required: true,
		type: [String],
		description: 'Players id list',
		example: [
			'01937d34-a986-7052-bc02-48e1bc0541e6',
			'01937d34-c960-7ef6-9990-2af0941879d3',
		],
	})
	players: string[];
}
