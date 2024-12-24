import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsPositive } from 'class-validator';
import {
	DefaultValue,
	IsOptional,
	ToBoolean,
	ToNumber,
} from 'src/decorators/dto.decorator';
import { ESortType } from 'src/interfaces/common.interface';
import { EEventGetAllSortColumn } from 'src/interfaces/events.interface';

export class ReqEventsByGroupGetAllQueryDto {
	@IsOptional()
	@IsEnum(ESortType)
	@DefaultValue(ESortType.DESC)
	@ApiProperty({
		required: false,
		enum: ESortType,
		description: 'Sort type',
		default: ESortType.DESC,
	})
	sortType?: ESortType;

	@IsOptional()
	@IsEnum(EEventGetAllSortColumn)
	@DefaultValue(EEventGetAllSortColumn.CREATED_AT)
	@ApiProperty({
		required: false,
		enum: EEventGetAllSortColumn,
		description: 'Column to be sorted',
		default: EEventGetAllSortColumn.CREATED_AT,
	})
	sortColumn?: EEventGetAllSortColumn;

	@IsOptional()
	@IsPositive()
	@DefaultValue(1)
	@ApiProperty({
		required: false,
		type: Number,
		description: 'Page requested',
		default: 1,
	})
	@ToNumber()
	page?: number;

	@IsOptional()
	@IsPositive()
	@DefaultValue(10)
	@ApiProperty({
		required: false,
		type: Number,
		description: 'Items per page',
		default: 10,
	})
	@ToNumber()
	limit?: number;

	@IsOptional()
	@IsBoolean()
	@DefaultValue(true)
	@ApiProperty({
		required: false,
		type: Boolean,
		description: 'Include on going events',
		default: true,
	})
	@ToBoolean()
	onGoing?: boolean;

	@IsOptional()
	@IsBoolean()
	@DefaultValue(true)
	@ApiProperty({
		required: false,
		type: Boolean,
		description: 'Include up coming events',
		default: true,
	})
	@ToBoolean()
	upComing?: boolean;

	@IsOptional()
	@IsBoolean()
	@DefaultValue(false)
	@ApiProperty({
		required: false,
		type: Boolean,
		description: 'Include past events',
		default: false,
	})
	@ToBoolean()
	past?: boolean;
}
