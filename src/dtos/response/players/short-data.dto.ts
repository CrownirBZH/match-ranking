import { ApiProperty } from "@nestjs/swagger";

export class ResPlayerShortDataDto {
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
}
