import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
	IsNullable,
	IsOptional,
	IsRequired,
	IsUTCDateTimeString,
} from 'src/decorators/dto.decorator';

export class ReqAdminEventCreateBodyDto {
	@IsRequired()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: true,
		type: String,
		description: 'Event name',
		example: 'Event 1',
	})
	name: string;

	@IsOptional()
	@IsNullable()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: false,
		type: String,
		description: 'Event description',
		example: 'Lorem ipsum...',
	})
	description?: string;

	@IsRequired()
	@IsUTCDateTimeString()
	@ApiProperty({
		required: true,
		type: String,
		description: 'Event start date',
		example: '2022-01-01T00:00:00Z',
	})
	startAt: string;

	@IsRequired()
	@IsUTCDateTimeString()
	@ApiProperty({
		required: true,
		type: String,
		description: 'Event end date',
		example: '2022-01-02T00:00:00Z',
	})
	endAt: string;
}
