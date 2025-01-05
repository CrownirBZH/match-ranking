import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsNotEmptyObject,
	IsString,
} from 'class-validator';
import {
	IsNullable,
	IsOptional,
	IsRequired,
	IsUTCDateTimeString,
	ToBoolean,
} from 'src/decorators/dto.decorator';
import { EEventType } from 'src/interfaces/events.interface';

export class ReqAdminEventCreateSettingsDto {
	@IsOptional()
	@IsBoolean()
	@ApiProperty({
		required: false,
		type: Boolean,
		description:
			'Specifies if the event will count in the group scoreboard',
		default: true,
	})
	@ToBoolean()
	countInGroupScoreboard = true;

	@IsOptional()
	@IsBoolean()
	@ApiProperty({
		required: false,
		type: Boolean,
		description: 'Specifies if the set detailed points are mandatory',
		default: false,
	})
	@ToBoolean()
	detailedSetMandatory = false;

	@IsOptional()
	@IsBoolean()
	@ApiProperty({
		required: false,
		type: Boolean,
		description: 'Specifies if the players can create matches',
		default: true,
	})
	@ToBoolean()
	playersCanCreateMatches = true;

	@IsOptional()
	@IsBoolean()
	@ApiProperty({
		required: false,
		type: Boolean,
		description:
			'Specifies if the players can validate matches they are part of',
		default: true,
	})
	@ToBoolean()
	playersCanValidateMatches = true;

	@IsOptional()
	@IsBoolean()
	@ApiProperty({
		required: false,
		type: Boolean,
		description:
			'Specifies if the matches are auto-validated when submitted',
		default: false,
	})
	@ToBoolean()
	matchAutovalidation = false;

	constructor(partial: Partial<ReqAdminEventCreateSettingsDto> = {}) {
		Object.assign(this, partial);
	}
}

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
	@IsEnum(EEventType)
	@ApiProperty({
		required: true,
		enum: EEventType,
		description: 'Event type',
	})
	type: EEventType;

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

	@IsOptional()
	@Type(() => ReqAdminEventCreateSettingsDto)
	@IsNotEmptyObject()
	@ApiProperty({
		required: false,
		type: ReqAdminEventCreateSettingsDto,
		description: 'Event settings',
	})
	settings: ReqAdminEventCreateSettingsDto =
		new ReqAdminEventCreateSettingsDto();

	@IsOptional()
	@IsString({ each: true })
	@ApiProperty({
		required: false,
		type: [String],
		description: 'Referees id list',
		example: [
			'01937d34-a986-7052-bc02-48e1bc0541e6',
			'01937d34-c960-7ef6-9990-2af0941879d3',
		],
	})
	referees: string[];
}
