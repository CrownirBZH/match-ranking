import { ApiProperty } from "@nestjs/swagger";

export class ResGroupShortDataDto {
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
		required: false,
		type: String,
		description: 'Group description',
		example: 'Lorem ipsum dolor sit amet',
	})
	description?: string;
}
