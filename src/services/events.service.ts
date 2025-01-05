import { ConflictException, Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { Event, Prisma } from '@prisma/client';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqAdminEventCreateBodyDto } from 'src/dtos/request/admin/events/create.body.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqEventsByGroupGetAllQueryDto } from 'src/dtos/request/events/get-all.query.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ResEventFullDataDto } from 'src/dtos/response/events/full-data.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ResEventLessDataDto } from 'src/dtos/response/events/less-data.dto';
// biome-ignore lint/style/useImportType: <explanation>
import {
	EEventGetAllSortColumn,
	EEventType,
	IEventsContainer,
	TEvent,
} from 'src/interfaces/events.interface';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/modules/prisma';
import { extractTimestampFromUUIDv7 } from 'src/utils/helper';
import { GroupsService } from './groups.service';
import { PlayersService } from './players/players.service';

@Injectable()
export class EventsService {
	constructor(private readonly prismaService: PrismaService) {}

	static activeRefereesInclude: Prisma.Event$refereesArgs = {
		where: { active: true },
		include: {
			player: true,
		},
	};

	static eventToEventFullData(event: TEvent): ResEventFullDataDto {
		return {
			id: event.id,
			name: event.name,
			description: event.description,
			type: event.type as EEventType,
			startAt: event.startAt,
			endAt: event.endAt,
			settings: {
				countInGroupScoreboard: event.countInGroupScoreboard,
				detailedSetMandatory: event.detailedSetMandatory,
				playersCanCreateMatches: event.playersCanCreateMatches,
				playersCanValidateMatches: event.playersCanValidateMatches,
				matchAutovalidation: event.matchAutovalidation,
			},
			group: GroupsService.groupToGroupFullData(event.group),
			referees: event.referees?.map((referee) =>
				PlayersService.playerToPlayerFullData(referee.player),
			),
			createdAt: extractTimestampFromUUIDv7(event.id),
			updatedAt: event.updatedAt,
			deletedAt: event.deletedAt,
		};
	}

	static eventToEventLessData(event: Event): ResEventLessDataDto {
		return {
			id: event.id,
			name: event.name,
			description: event.description,
			type: event.type as EEventType,
			startAt: event.startAt,
			endAt: event.endAt,
			createdAt: extractTimestampFromUUIDv7(event.id),
			updatedAt: event.updatedAt,
			deletedAt: event.deletedAt,
		};
	}

	async getEventByName(name: string): Promise<ResEventFullDataDto> {
		if (!name) return null;
		const event = await this.prismaService.event.findUnique({
			where: { name },
			include: {
				group: {
					include: GroupsService.activeGroupInclude,
				},
			},
		});
		if (!event) return null;

		return EventsService.eventToEventFullData(event as unknown as TEvent);
	}

	async createEvent(
		groupId: string,
		body: ReqAdminEventCreateBodyDto,
	): Promise<ResEventFullDataDto> {
		const { settings, referees, ...rest } = body;
		const data = { ...rest, ...settings };

		const event = await this.prismaService.event.create({
			data: {
				...data,
				group: {
					connect: {
						id: groupId,
					},
				},
				referees: {
					createMany: {
						data: body.referees
							? body.referees.map((playerId) => ({
									playerId,
								}))
							: [],
					},
				},
			},
			include: {
				group: {
					include: GroupsService.activeGroupInclude,
				},
				referees: EventsService.activeRefereesInclude,
			},
		});

		return EventsService.eventToEventFullData(event as unknown as TEvent);
	}

	async getAllEventsByGroupId(
		groupId: string,
		query: ReqEventsByGroupGetAllQueryDto,
	): Promise<IEventsContainer> {
		const { sortType, page, limit } = query;
		let { sortColumn } = query;

		const offset = (page - 1) * limit;

		sortColumn =
			sortColumn === EEventGetAllSortColumn.CREATED_AT
				? EEventGetAllSortColumn.ID
				: sortColumn;

		const now = new Date();

		const filters: Prisma.EventWhereInput[] = [];

		if (query.upcoming)
			filters.push({
				startAt: { gt: now },
			});

		if (query.ongoing)
			filters.push({
				startAt: { lte: now },
				endAt: { gte: now },
			});

		if (query.past)
			filters.push({
				endAt: { lt: now },
			});

		const whereClause: Prisma.EventWhereInput = {
			deletedAt: null,
			groupId,
			...(filters.length > 0 && { OR: filters }),
		};

		const totalCount = await this.prismaService.event.count({
			where: whereClause,
		});

		const totalPages = Math.ceil(totalCount / limit);

		const events = await this.prismaService.event.findMany({
			where: whereClause,
			orderBy: {
				[sortColumn]: sortType,
			},
			skip: offset,
			take: limit,
		});

		return {
			data: events.map((event) =>
				EventsService.eventToEventLessData(event),
			),
			totalCount,
			totalPages,
			page,
			limit,
			sortType,
			sortColumn,
			filters: {
				upcoming: query.upcoming,
				ongoing: query.ongoing,
				past: query.past,
			},
		};
	}

	public async isEventNameAvailableOrFail(
		name: string,
		currentEventId?: string,
	): Promise<void> {
		const event = await this.getEventByName(name);
		if (
			(currentEventId === undefined && event) ||
			name?.startsWith('deleted_') ||
			(event && event.id !== currentEventId)
		) {
			throw new ConflictException(
				'An event with the same name already exists',
				'EVENT_ALREADY_EXISTS',
			);
		}
	}
}
