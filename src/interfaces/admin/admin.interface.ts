import type { ResAdminFullDataDto } from 'src/dtos/response/admin/full-data.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { IContainer } from '../common.interface';

export enum EAdminGetAllSortColumn {
	USERNAME = 'username',
	FIRSTNAME = 'firstname',
	LASTNAME = 'lastname',
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt',
	DELETE_AT = 'deletedAt',
}

export interface IAdminContainer extends IContainer {
	data: ResAdminFullDataDto[];
}
