import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import type { ReqAdminCreateBodyDto } from 'src/dtos/request/admin/create.body.dto';
import type { ReqAdminPlayerGetAllQueryDto } from 'src/dtos/request/admin/players/get-all.query.dto';
import type { ResPlayerFullDataDto } from 'src/dtos/response/players/full-data.dto';
import {
	EPlayerGetAllSortColumn,
	type IPlayersContainer,
} from 'src/interfaces/admin/players.interface';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/modules/prisma';
import { PlayersService } from '../players/players.service';

const { PASSWORD_SALT_ROUNDS = '10' } = process.env;

@Injectable()
export class AdminPlayersService {
	constructor(private readonly prismaService: PrismaService) {}

	async createPlayer(
		body: ReqAdminCreateBodyDto,
	): Promise<ResPlayerFullDataDto> {
		const hashedSaltedPassword = await bcrypt.hash(
			body.password,
			Number(PASSWORD_SALT_ROUNDS),
		);

		const player = await this.prismaService.player.create({
			data: {
				...body,
				password: hashedSaltedPassword,
			},
		});

		return PlayersService.playerToPlayerFullData(player);
	}

	async getAllPlayers(
		query: ReqAdminPlayerGetAllQueryDto,
	): Promise<IPlayersContainer> {
		const { sortType, page, limit } = query;
		let { sortColumn } = query;

		const offset = (page - 1) * limit;

		sortColumn =
			sortColumn === EPlayerGetAllSortColumn.CREATED_AT
				? ('id' as EPlayerGetAllSortColumn)
				: sortColumn;

		const totalCount = await this.prismaService.player.count({
			where: { deletedAt: null },
		});

		const totalPages = Math.ceil(totalCount / limit);

		const players = await this.prismaService.player.findMany({
			where: { deletedAt: null },
			orderBy: {
				[sortColumn]: sortType,
			},
			skip: offset,
			take: limit,
		});

		return {
			data: players.map(PlayersService.playerToPlayerFullData),
			totalCount,
			totalPages,
			page,
			limit,
			sortType,
			sortColumn,
		};
	}
}
