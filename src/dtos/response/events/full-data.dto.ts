import { ApiProperty } from '@nestjs/swagger';
import { ResGroupFullDataDto } from '../groups/full-data.dto';

export class ResEventFullDataDto {
	@ApiProperty({
		required: true,
		type: String,
		description: 'Event ID',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	id: string;

	@ApiProperty({
		required: true,
		type: String,
		description: 'Event name',
		example: 'group',
	})
	name: string;

	@ApiProperty({
		required: true,
		type: String,
		description: 'Event description',
		example: 'Lorem',
	})
	description: string | null;

	@ApiProperty({
		required: true,
		type: Date,
		description: 'Event start date',
		example: '2021-01-01T00:00:00.000Z',
	})
	startAt: Date;

	@ApiProperty({
		required: true,
		type: Date,
		description: 'Event end date',
		example: '2021-01-01T00:00:00.000Z',
	})
	endAt: Date;

	@ApiProperty({
		required: true,
		type: ResGroupFullDataDto,
		description: 'Group data',
		example: [
			{
				id: '123e4567-e89b-12d3-a456-426614174000',
				name: 'group',
				description: 'Lorem ipsum...',
				players: [],
				createdAt: '2021-01-01T00:00:00.000Z',
				updateAt: '2021-01-01T00:00:00.000Z',
				deletedAt: null,
			},
		],
	})
	group: ResGroupFullDataDto;

	@ApiProperty({
		required: true,
		type: Date,
		description: 'Date and time when the event was created',
		example: '2021-01-01T00:00:00.000Z',
	})
	createdAt: Date;

	@ApiProperty({
		required: true,
		type: Date,
		description: 'Date and time when the event was last updated',
		example: '2021-01-01T00:00:00.000Z',
	})
	updatedAt: Date;

	@ApiProperty({
		required: true,
		type: Date,
		description: 'Date and time when the event was deleted',
		example: '2021-01-01T00:00:00.000Z',
	})
	deletedAt: Date | null;
}
