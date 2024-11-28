import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsPositive } from 'class-validator';
import {
	DefaultValue,
	IsOptional,
	ToNumber,
} from 'src/decorators/dto.decorator';
import { EAdminGetAllSortColumn } from 'src/interfaces/admin/admin.interface';
import {
	EAccountStatusFilter,
	ESortType,
} from 'src/interfaces/common.interface';

export class ReqAdminGetAllQueryDto {
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
	@IsEnum(EAdminGetAllSortColumn)
	@DefaultValue(EAdminGetAllSortColumn.CREATED_AT)
	@ApiProperty({
		required: false,
		enum: EAdminGetAllSortColumn,
		description: 'Column to be sorted',
		default: EAdminGetAllSortColumn.CREATED_AT,
	})
	sortColumn: EAdminGetAllSortColumn;

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
	@IsEnum(EAccountStatusFilter)
	@DefaultValue(EAccountStatusFilter.ACTIVE)
	@ApiProperty({
		required: false,
		enum: EAccountStatusFilter,
		description: 'Player status',
		default: EAccountStatusFilter.ACTIVE,
	})
	status?: EAccountStatusFilter;
}
