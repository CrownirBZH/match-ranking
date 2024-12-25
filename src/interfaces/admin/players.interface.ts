import type { ResPlayerFullDataDto } from 'src/dtos/response/players/full-data.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { IContainer } from '../common.interface';

export enum EPlayerGetAllSortColumn {
	USERNAME = 'username',
	FIRSTNAME = 'firstname',
	LASTNAME = 'lastname',
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt',
	DELETE_AT = 'deletedAt',
}

export interface IPlayersContainer extends IContainer {
	data: ResPlayerFullDataDto[];
}
