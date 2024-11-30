import { ApiProperty } from '@nestjs/swagger';
import { ResGroupShortDataDto } from '../groups/short-data.dto';

export class AdminValidatorDto {
	@ApiProperty({
		required: true,
		type: String,
		description: 'Admin validator ID',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	id: string;

	@ApiProperty({
		required: true,
		type: String,
		description: 'Admin validator firstname',
		example: 'John',
	})
	firstname: string | null;

	@ApiProperty({
		required: true,
		type: String,
		description: 'Admin validator lastname',
		example: 'Doe',
	})
	lastname: string | null;
}

export class ValidationDataDto {
	@ApiProperty({
		required: true,
		type: Boolean,
		description: 'Is the account validated',
		example: true,
	})
	validated: boolean;

	@ApiProperty({
		required: true,
		type: AdminValidatorDto,
		description: 'Admin validator data',
		example: {
			id: '123e4567-e89b-12d3-a456-426614174000',
			firstname: 'John',
			lastname: 'Doe',
		},
	})
	adminValidator: AdminValidatorDto | null;

	@ApiProperty({
		required: true,
		type: Date,
		description: 'Date and time when the account was validated',
		example: '2021-01-01T00:00:00.000Z',
	})
	validatedAt: Date | null;
}

export class SesameDataDto {
	@ApiProperty({
		required: true,
		type: Boolean,
		description: 'Is the account linked to a Sésame account',
		example: true,
	})
	linked: boolean;

	@ApiProperty({
		required: true,
		type: String,
		description: 'Sésame account ID',
		example: 'toto123',
	})
	id: string | null;

	@ApiProperty({
		required: true,
		type: Date,
		description: 'Date and time when the Sésame account was linked',
		example: '2021-01-01T00:00:00.000Z',
	})
	linkedAt: Date | null;
}

export class ResPlayerFullDataDto {
	@ApiProperty({
		required: true,
		type: String,
		description: 'Player user ID',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	id: string;

	@ApiProperty({
		required: true,
		type: String,
		description: 'Player username',
		example: 'player',
	})
	username: string;

	@ApiProperty({
		required: true,
		type: SesameDataDto,
		description: 'Sésame account data',
		example: {
			linked: true,
			id: 'toto123',
			linkedAt: '2021-01-01T00:00:00.000Z',
		},
	})
	sesame: SesameDataDto;

	@ApiProperty({
		required: true,
		type: String,
		description: 'Player firstname',
		example: 'John',
	})
	firstname: string;

	@ApiProperty({
		required: true,
		type: String,
		description: 'Player lastname',
		example: 'Doe',
	})
	lastname: string;

	@ApiProperty({
		required: true,
		type: ValidationDataDto,
		description: 'Account validation data',
		example: {
			validated: true,
			adminValidator: {
				id: '123e4567-e89b-12d3-a456-426614174000',
				firstname: 'John',
				lastname: 'Doe',
			},
			validatedAt: '2021-01-01T00:00:00.000Z',
		},
	})
	validationStatus: ValidationDataDto;

	@ApiProperty({
		required: true,
		type: [ResGroupShortDataDto],
		description: 'List of groups the player is in',
		example: [
			{
				id: '123e4567-e89b-12d3-a456-426614174000',
				name: 'group',
				description: 'Lorem ipsum dolor sit amet',
			},
		],
	})
	groups: ResGroupShortDataDto[];

	@ApiProperty({
		required: true,
		type: Date,
		description: 'Date and time when the user was created',
		example: '2021-01-01T00:00:00.000Z',
	})
	createdAt: Date;

	@ApiProperty({
		required: true,
		type: Date,
		description: 'Date and time when the user was last updated',
		example: '2021-01-01T00:00:00.000Z',
	})
	updatedAt: Date;

	@ApiProperty({
		required: true,
		type: Date,
		description: 'Date and time when the user was deleted',
		example: '2021-01-01T00:00:00.000Z',
	})
	deletedAt: Date | null;
}
