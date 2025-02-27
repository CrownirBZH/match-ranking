import { ApiProperty } from '@nestjs/swagger';
import { ResPlayerFullDataDto } from '../players/full-data.dto';

export class ResGroupFullDataDto {
	@ApiProperty({
		required: true,
		type: String,
		description: 'Group ID',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	id: string;

	@ApiProperty({
		required: true,
		type: String,
		description: 'Group name',
		example: 'group',
	})
	name: string;

	@ApiProperty({
		required: true,
		type: String,
		description: 'Group description',
		example: 'Lorem',
	})
	description: string | null;

	@ApiProperty({
		required: true,
		type: [ResPlayerFullDataDto],
		description: 'List of players in the group',
		example: [
			{
				id: '123e4567-e89b-12d3-a456-426614174000',
				username: 'player',
				firstname: 'John',
				lastname: 'Doe',
				createdAt: '2021-01-01T00:00:00.000Z',
				updatedAt: '2021-01-01T00:00:00.000Z',
				deletedAt: null,
			},
		],
	})
	players: ResPlayerFullDataDto[];

	@ApiProperty({
		required: true,
		type: Date,
		description: 'Date and time when the group was created',
		example: '2021-01-01T00:00:00.000Z',
	})
	createdAt: Date;

	@ApiProperty({
		required: true,
		type: Date,
		description: 'Date and time when the group was last updated',
		example: '2021-01-01T00:00:00.000Z',
	})
	updatedAt: Date;

	@ApiProperty({
		required: true,
		type: Date,
		description: 'Date and time when the group was deleted',
		example: '2021-01-01T00:00:00.000Z',
	})
	deletedAt: Date | null;
}
