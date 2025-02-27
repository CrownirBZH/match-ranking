import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsPositive } from 'class-validator';
import {
	DefaultValue,
	IsOptional,
	ToNumber,
} from 'src/decorators/dto.decorator';
import { ESortType } from 'src/interfaces/common.interface';
import { EGroupGetAllSortColumn } from 'src/interfaces/groups.interface';

export class ReqGroupGetAllQueryDto {
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
	@IsEnum(EGroupGetAllSortColumn)
	@DefaultValue(EGroupGetAllSortColumn.CREATED_AT)
	@ApiProperty({
		required: false,
		enum: EGroupGetAllSortColumn,
		description: 'Column to be sorted',
		default: EGroupGetAllSortColumn.CREATED_AT,
	})
	sortColumn?: EGroupGetAllSortColumn;

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
}
