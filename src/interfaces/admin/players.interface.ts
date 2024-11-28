import type { ResPlayerFullDataDto } from 'src/dtos/response/players/full-data.dto';

export enum EPlayerGetAllSortColumn {
	USERNAME = 'username',
	FIRSTNAME = 'firstname',
	LASTNAME = 'lastname',
	ACCOUNT_VALIDATED_AT = 'accountValidatedAt',
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt',
	DELETE_AT = 'deletedAt',
}

export interface IPlayersContainer {
	players: ResPlayerFullDataDto[];
	totalCount: number;
	totalPages: number;
	page: number;
	limit: number;
}
