import type { ResAdminFullDataDto } from 'src/dtos/response/admin/full-data.dto';

export enum EAdminGetAllSortColumn {
	USERNAME = 'username',
	FIRSTNAME = 'firstname',
	LASTNAME = 'lastname',
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt',
	DELETE_AT = 'deletedAt',
}

export interface IAdminContainer {
	admin: ResAdminFullDataDto[];
	totalCount: number;
	totalPages: number;
	page: number;
	limit: number;
}
