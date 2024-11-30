// biome-ignore lint/style/useImportType: <explanation>
import { Group, Player } from '@prisma/client';
// biome-ignore lint/style/useImportType: <explanation>
import { ResGroupFullDataDto } from 'src/dtos/response/groups/full-data.dto';

export enum EGroupGetAllSortColumn {
	NAME = 'name',
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt',
	DELETE_AT = 'deletedAt',
}

export interface IGroupsContainer {
	groups: ResGroupFullDataDto[];
	totalCount: number;
	totalPages: number;
	page: number;
	limit: number;
}

export type TGroupWithUsers = Group & {
	players: { player: Partial<Player> }[];
};
