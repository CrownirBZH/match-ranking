// biome-ignore lint/style/useImportType: <explanation>
import { Event, Group, Player } from '@prisma/client';
// biome-ignore lint/style/useImportType: <explanation>
import { ResEventLessDataDto } from 'src/dtos/response/events/less-data.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { IContainer } from './common.interface';

export enum EEventGetAllSortColumn {
	ID = 'id',
	NAME = 'name',
	CREATED_AT = 'createdAt',
	UPDATED_AT = 'updatedAt',
	DELETE_AT = 'deletedAt',
}

export interface IEventsContainer extends IContainer {
	data: ResEventLessDataDto[];
}

export type TEventWithGroupUsers = Event & {
	group: Group & { players: { player: Player }[] };
};
