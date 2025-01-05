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

export enum EEventType {
	TRAINING_1V1 = 'TRAINING_1V1',
	TRAINING_2V2 = 'TRAINING_2V2',
	TOURNAMENT_1V1 = 'TOURNAMENT_1V1',
	TOURNAMENT_2V2 = 'TOURNAMENT_2V2',
}

export interface IEventsContainer extends IContainer {
	data: ResEventLessDataDto[];
}

export type TEvent = Event & {
	group: Group & {
		players: { player: Player }[];
	};
	referees: { player: Player }[];
};
