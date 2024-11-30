import { Injectable, NotFoundException } from '@nestjs/common';
import { EStatusFilter } from 'src/interfaces/common.interface';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/modules/prisma';
import { extractTimestampFromUUIDv7 } from 'src/utils/helper';
import { PlayersService } from './players/players.service';
// biome-ignore lint/style/useImportType: <explanation>
import { ResGroupFullDataDto } from 'src/dtos/response/groups/full-data.dto';
// biome-ignore lint/style/useImportType: <explanation>
import {
	EGroupGetAllSortColumn,
	IGroupsContainer,
} from 'src/interfaces/groups.interface';
// biome-ignore lint/style/useImportType: <explanation>
import { Group, Player } from '@prisma/client';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqGroupGetAllQueryDto } from 'src/dtos/request/groups/get-all.query.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ResGroupShortDataDto } from 'src/dtos/response/groups/short-data.dto';

@Injectable()
export class GroupsService {
	constructor(private readonly prismaService: PrismaService) {}

	static groupToGroupFullData(
		group: Group & { players: Partial<Player>[] },
	): ResGroupFullDataDto {
		return {
			id: group.id,
			name: group.name,
			description: group.description,
			players: group.players.map(PlayersService.playerToPlayerShortData),
			createdAt: extractTimestampFromUUIDv7(group.id),
			updatedAt: group.updatedAt,
			deletedAt: group.deletedAt,
		};
	}

	static groupToGroupShortData(group: Group): ResGroupShortDataDto {
		return {
			id: group.id,
			name: group.name,
			description: group.description,
		};
	}

	async getGroupById(id: string): Promise<ResGroupFullDataDto> {
		const group = await this.prismaService.group.findUnique({
			where: { id },
			include: { players: true },
		});
		if (!group) return null;

		return GroupsService.groupToGroupFullData(group);
	}

	async getGroupByName(name: string): Promise<ResGroupFullDataDto> {
		if (!name) return null;
		const group = await this.prismaService.group.findUnique({
			where: { name },
			include: { players: true },
		});
		if (!group) return null;

		return GroupsService.groupToGroupFullData(group);
	}

	async getActiveGroupByIdOrFail(id: string): Promise<ResGroupFullDataDto> {
		const group = await this.getGroupById(id);
		if (!group || group.deletedAt)
			throw new NotFoundException(
				`Group with id '${id}' not found`,
				'GROUP_NOT_FOUND',
			);

		return group;
	}

	async getAllGroups(
		query: ReqGroupGetAllQueryDto,
	): Promise<IGroupsContainer> {
		const { sortType, page, limit, status } = query;
		let { sortColumn } = query;

		const offset = (page - 1) * limit;

		const whereClause =
			status === EStatusFilter.ALL
				? {}
				: status === EStatusFilter.ACTIVE
					? { deletedAt: null }
					: { deletedAt: { not: null } };

		sortColumn =
			sortColumn === EGroupGetAllSortColumn.CREATED_AT
				? ('id' as EGroupGetAllSortColumn)
				: sortColumn;

		const totalCount = await this.prismaService.group.count({
			where: whereClause,
		});

		const totalPages = Math.ceil(totalCount / limit);

		const players = await this.prismaService.group.findMany({
			where: whereClause,
			orderBy: {
				[sortColumn]: sortType,
			},
			skip: offset,
			take: limit,
			include: { players: true },
		});

		return {
			groups: players.map(GroupsService.groupToGroupFullData),
			totalCount,
			totalPages,
			page,
			limit,
		};
	}
}
