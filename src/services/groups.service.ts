import { Injectable, NotFoundException } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { Prisma } from '@prisma/client';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqGroupGetAllQueryDto } from 'src/dtos/request/groups/get-all.query.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ResGroupFullDataDto } from 'src/dtos/response/groups/full-data.dto';
// biome-ignore lint/style/useImportType: <explanation>
import {
	EGroupGetAllSortColumn,
	IGroupsContainer,
	TGroupWithUsers,
} from 'src/interfaces/groups.interface';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/modules/prisma';
import { extractTimestampFromUUIDv7 } from 'src/utils/helper';
import { PlayersService } from './players/players.service';

@Injectable()
export class GroupsService {
	constructor(private readonly prismaService: PrismaService) {}

	static activeGroupInclude: Prisma.GroupInclude = {
		players: {
			where: { active: true },
			select: {
				player: true,
			},
		},
	};

	static groupToGroupFullData(group: TGroupWithUsers): ResGroupFullDataDto {
		return {
			id: group.id,
			name: group.name,
			description: group.description,
			players: group.players?.map((p) =>
				PlayersService.playerToPlayerFullData(p.player),
			),
			createdAt: extractTimestampFromUUIDv7(group.id),
			updatedAt: group.updatedAt,
			deletedAt: group.deletedAt,
		};
	}

	async getGroupById(id: string): Promise<ResGroupFullDataDto> {
		const group = await this.prismaService.group.findUnique({
			where: { id },
			include: GroupsService.activeGroupInclude,
		});
		if (!group) return null;

		return GroupsService.groupToGroupFullData(
			group as unknown as TGroupWithUsers,
		);
	}

	async getGroupByName(name: string): Promise<ResGroupFullDataDto> {
		if (!name) return null;
		const group = await this.prismaService.group.findUnique({
			where: { name },
			include: GroupsService.activeGroupInclude,
		});
		if (!group) return null;

		return GroupsService.groupToGroupFullData(
			group as unknown as TGroupWithUsers,
		);
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

	async getActiveGroupsByPlayerId(
		playerId: string,
	): Promise<ResGroupFullDataDto[]> {
		const groups = (
			await this.prismaService.groupPlayer.findMany({
				where: { playerId, active: true },
				include: {
					group: { include: GroupsService.activeGroupInclude },
				},
			})
		)?.map((gp) => gp.group);

		return groups.map((group) =>
			GroupsService.groupToGroupFullData(
				group as unknown as TGroupWithUsers,
			),
		);
	}

	async getAllGroups(
		query: ReqGroupGetAllQueryDto,
	): Promise<IGroupsContainer> {
		const { sortType, page, limit } = query;
		let { sortColumn } = query;

		const offset = (page - 1) * limit;

		sortColumn =
			sortColumn === EGroupGetAllSortColumn.CREATED_AT
				? EGroupGetAllSortColumn.ID
				: sortColumn;

		const totalCount = await this.prismaService.group.count({
			where: { deletedAt: null },
		});

		const totalPages = Math.ceil(totalCount / limit);

		const players = await this.prismaService.group.findMany({
			where: { deletedAt: null },
			orderBy: {
				[sortColumn]: sortType,
			},
			skip: offset,
			take: limit,
			include: GroupsService.activeGroupInclude,
		});

		return {
			data: players.map((group) =>
				GroupsService.groupToGroupFullData(
					group as unknown as TGroupWithUsers,
				),
			),
			totalCount,
			totalPages,
			page,
			limit,
			sortType,
			sortColumn,
		};
	}
}
