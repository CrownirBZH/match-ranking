import { ApiProperty } from '@nestjs/swagger';
import {
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsPositive,
	IsString,
} from 'class-validator';
// biome-ignore lint/style/useImportType: <explanation>
import { DateTime } from 'luxon';
import {
	IsRequired,
	IsUTCDateTimeString,
	ToBoolean,
	ToDateTime,
	ToNumber,
} from 'src/decorators/dto.decorator';

export class UserQueryDto {
	@IsRequired()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: true,
		type: String,
		description: 'User firstname',
		example: 'John',
	})
	firstname: string;

	@IsRequired()
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		required: true,
		type: String,
		description: 'User lastname',
		example: 'Doe',
	})
	lastname: string;

	@IsRequired()
	@IsUTCDateTimeString()
	@ApiProperty({
		required: true,
		type: Date,
		description: 'User date of birth',
		example: '2004-10-02T22:00:00.000Z',
	})
	@ToDateTime()
	dob: DateTime;

	@IsOptional()
	@IsBoolean()
	@ApiProperty({
		required: false,
		type: Boolean,
		description: 'User is active',
		example: true,
	})
	@ToBoolean()
	isActive?: boolean;

	@IsOptional()
	@IsPositive()
	@ApiProperty({
		required: false,
		type: Number,
		description: 'User age',
		example: 19,
	})
	@ToNumber()
	age?: number;
}
