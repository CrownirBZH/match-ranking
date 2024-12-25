// biome-ignore lint/style/useImportType: <explanation>
import { Group, Player } from '@prisma/client';
// biome-ignore lint/style/useImportType: <explanation>
import { ResGroupFullDataDto } from 'src/dtos/response/groups/full-data.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { IContainer } from './common.interface';

export enum EGroupGetAllSortColumn {
	ID = 'id',
	NAME = 'name',
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt',
	DELETE_AT = 'deletedAt',
}

export interface IGroupsContainer extends IContainer {
	data: ResGroupFullDataDto[];
}

export type TGroupWithUsers = Group & {
	players: { player: Player }[];
};
