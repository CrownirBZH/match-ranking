// biome-ignore lint/style/useImportType: <explanation>
import { Event, Group, Player } from '@prisma/client';
// biome-ignore lint/style/useImportType: <explanation>
import { ResEventLessDataDto } from 'src/dtos/response/events/less-data.dto';

export enum EEventGetAllSortColumn {
	ID = 'id',
	NAME = 'name',
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt',
	DELETE_AT = 'deletedAt',
}

export interface IEventsContainer {
	events: ResEventLessDataDto[];
	totalCount: number;
	totalPages: number;
	page: number;
	limit: number;
	filters: Record<string, unknown>;
}

export type TEventWithGroupUsers = Event & {
	group: Group & { players: { player: Player }[] };
};
