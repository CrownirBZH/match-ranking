import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsPositive } from 'class-validator';
import {
	DefaultValue,
	IsOptional,
	ToNumber,
} from 'src/decorators/dto.decorator';
import { EPlayerGetAllSortColumn } from 'src/interfaces/admin/players.interface';
import { ESortType } from 'src/interfaces/common.interface';

export class ReqAdminPlayerGetAllQueryDto {
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
	@IsEnum(EPlayerGetAllSortColumn)
	@DefaultValue(EPlayerGetAllSortColumn.CREATED_AT)
	@ApiProperty({
		required: false,
		enum: EPlayerGetAllSortColumn,
		description: 'Column to be sorted',
		default: EPlayerGetAllSortColumn.CREATED_AT,
	})
	sortColumn?: EPlayerGetAllSortColumn;

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
