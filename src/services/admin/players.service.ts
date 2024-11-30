import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import type { ReqAdminCreateBodyDto } from 'src/dtos/request/admin/create.body.dto';
import type { ReqAdminPlayerGetAllQueryDto } from 'src/dtos/request/admin/players/get-all.query.dto';
import type { ResPlayerFullDataDto } from 'src/dtos/response/players/full-data.dto';
import {
	EPlayerGetAllSortColumn,
	type IPlayersContainer,
} from 'src/interfaces/admin/players.interface';
import { EStatusFilter } from 'src/interfaces/common.interface';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/modules/prisma';
import { PlayersService } from '../players/players.service';

const { PASSWORD_SALT_ROUNDS = '10' } = process.env;

@Injectable()
export class AdminPlayersService {
	constructor(private readonly prismaService: PrismaService) {}

	async createPlayer(
		body: ReqAdminCreateBodyDto,
		adminId: string,
	): Promise<ResPlayerFullDataDto> {
		const hashedSaltedPassword = await bcrypt.hash(
			body.password,
			Number(PASSWORD_SALT_ROUNDS),
		);

		const player = await this.prismaService.player.create({
			data: {
				...body,
				password: hashedSaltedPassword,
				accountValidatedAt: new Date(),
				adminValidator: { connect: { id: adminId } },
			},
			include: {
				adminValidator: true,
				groups: {
					select: {
						id: true,
						name: true,
						description: true,
					},
					where: {
						deletedAt: null,
					},
				},
			},
		});

		return PlayersService.playerToPlayerFullData(player);
	}

	async getAllPlayers(
		query: ReqAdminPlayerGetAllQueryDto,
	): Promise<IPlayersContainer> {
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
			sortColumn === EPlayerGetAllSortColumn.CREATED_AT
				? ('id' as EPlayerGetAllSortColumn)
				: sortColumn;

		const totalCount = await this.prismaService.player.count({
			where: whereClause,
		});

		const totalPages = Math.ceil(totalCount / limit);

		const players = await this.prismaService.player.findMany({
			where: whereClause,
			orderBy: {
				[sortColumn]: sortType,
			},
			skip: offset,
			take: limit,
			include: {
				adminValidator: true,
				groups: {
					select: {
						id: true,
						name: true,
						description: true,
					},
					where: {
						deletedAt: null,
					},
				},
			},
		});

		return {
			players: players.map(PlayersService.playerToPlayerFullData),
			totalCount,
			totalPages,
			page,
			limit,
		};
	}
}
