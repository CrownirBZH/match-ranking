export enum ESortType {
	ASC = 'asc',
	DESC = 'desc',
}

export interface IContainer {
	data: unknown[];
	totalCount: number;
	totalPages: number;
	page: number;
	limit: number;
	sortType: ESortType;
	sortColumn: string;
	filters?: Record<string, unknown>;
}
