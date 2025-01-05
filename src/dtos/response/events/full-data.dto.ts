import { ApiProperty } from '@nestjs/swagger';
import { ResGroupFullDataDto } from '../groups/full-data.dto';
import { EEventType } from 'src/interfaces/events.interface';
import { ResPlayerFullDataDto } from '../players/full-data.dto';

export class ResEventSettingsDto {
	@ApiProperty({
		required: true,
		type: Boolean,
		description:
			'Specifies if the event will count in the group scoreboard',
		example: true,
	})
	countInGroupScoreboard: boolean;

	@ApiProperty({
		required: true,
		type: Boolean,
		description: 'Specifies if the set detailed points are mandatory',
		example: true,
	})
	detailedSetMandatory: boolean;

	@ApiProperty({
		required: true,
		type: Boolean,
		description: 'Specifies if players can create matches',
		example: true,
	})
	playersCanCreateMatches: boolean;

	@ApiProperty({
		required: true,
		type: Boolean,
		description:
			'Specifies if the players can validate matches they are part of',
		example: true,
	})
	playersCanValidateMatches: boolean;

	@ApiProperty({
		required: true,
		type: Boolean,
		description:
			'Specifies if the matches are auto-validated when submitted',
		example: false,
	})
	matchAutovalidation: boolean;
}

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
		enum: EEventType,
		description: 'Event type',
		example: EEventType.TRAINING_1V1,
	})
	type: EEventType;

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
		type: ResEventSettingsDto,
		description: 'Event settings',
		example: {
			countInGroupScoreboard: true,
			detailedSetMandatory: true,
			playersCanCreateMatches: true,
			playersCanValidateMatches: true,
			matchAutovalidation: false,
		},
	})
	settings: ResEventSettingsDto;

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
		type: [ResPlayerFullDataDto],
		description: 'List of referees for the event',
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
	referees: ResPlayerFullDataDto[];

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
