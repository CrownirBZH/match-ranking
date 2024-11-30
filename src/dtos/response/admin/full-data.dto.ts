import { ApiProperty } from '@nestjs/swagger';

export class ResAdminFullDataDto {
	@ApiProperty({
		required: true,
		type: String,
		description: 'ID of the newly created user',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	id: string;

	@ApiProperty({
		required: true,
		type: String,
		description: 'Username of the newly created user',
		example: 'admin',
	})
	username: string;

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
