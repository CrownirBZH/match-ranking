import { Injectable, NotFoundException } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { Group, Player, Prisma } from '@prisma/client';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqGroupGetAllQueryDto } from 'src/dtos/request/groups/get-all.query.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ResGroupFullDataDto } from 'src/dtos/response/groups/full-data.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ResGroupShortDataDto } from 'src/dtos/response/groups/short-data.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ResPlayerShortDataDto } from 'src/dtos/response/players/short-data.dto';
// biome-ignore lint/style/useImportType: <explanation>
import {
	EGroupGetAllSortColumn,
	IGroupsContainer,
	TGroupWithUsers,
} from 'src/interfaces/groups.interface';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/modules/prisma';
import { extractTimestampFromUUIDv7 } from 'src/utils/helper';

@Injectable()
export class GroupsService {
	constructor(private readonly prismaService: PrismaService) {}

	static groupActiveInclude: Prisma.GroupInclude = {
		players: {
			where: { active: true },
			select: {
				player: {
					select: {
						id: true,
						username: true,
						firstname: true,
						lastname: true,
					},
				},
			},
		},
	};

	static groupToGroupFullData(
		group: Group & { players: { player: Partial<Player> }[] },
	): ResGroupFullDataDto {
		return {
			id: group.id,
			name: group.name,
			description: group.description,
			players: group.players?.map(
				(p) => p.player as ResPlayerShortDataDto,
			),
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
			include: GroupsService.groupActiveInclude,
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
			include: GroupsService.groupActiveInclude,
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
				include: { group: true },
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
				? ('id' as EGroupGetAllSortColumn)
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
			include: GroupsService.groupActiveInclude,
		});

		return {
			groups: players.map((group) =>
				GroupsService.groupToGroupFullData(
					group as unknown as TGroupWithUsers,
				),
			),
			totalCount,
			totalPages,
			page,
			limit,
		};
	}
}
