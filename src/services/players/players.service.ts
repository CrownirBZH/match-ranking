import { ConflictException, Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { Player } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import type { ReqPlayerUpdateBodyDto } from 'src/dtos/request/players/update.body.dto';
import type { ResPlayerFullDataDto } from 'src/dtos/response/players/full-data.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/modules/prisma';
import { extractTimestampFromUUIDv7 } from 'src/utils/helper';

const { PASSWORD_SALT_ROUNDS = '10' } = process.env;

@Injectable()
export class PlayersService {
	constructor(private readonly prismaService: PrismaService) {}

	static playerToPlayerFullData(player: Player): ResPlayerFullDataDto {
		return {
			id: player.id,
			username: player.username,
			firstname: player.firstname,
			lastname: player.lastname,
			createdAt: extractTimestampFromUUIDv7(player.id),
			updatedAt: player.updatedAt,
			deletedAt: player.deletedAt,
		};
	}

	async getPlayersNotInList(ids: string[]): Promise<string[]> {
		const players = await this.prismaService.player.findMany({
			where: { id: { in: ids }, deletedAt: null },
			select: { id: true },
		});
		return (
			ids?.filter((id) => !players.some((player) => player.id === id)) ??
			[]
		);
	}

	async getPlayerById(id: string): Promise<ResPlayerFullDataDto> {
		const player = await this.prismaService.player.findUnique({
			where: { id },
		});
		if (!player) return null;

		return PlayersService.playerToPlayerFullData(player);
	}

	async getPlayerByUsername(username: string): Promise<ResPlayerFullDataDto> {
		if (!username) return null;
		const player = await this.prismaService.player.findUnique({
			where: { username },
		});
		if (!player) return null;

		return PlayersService.playerToPlayerFullData(player);
	}

	async updatePlayerById(
		id: string,
		body: ReqPlayerUpdateBodyDto,
	): Promise<ResPlayerFullDataDto> {
		const { password, ...playerData } = body;

		const hashedSaltedPassword = password
			? await bcrypt.hash(password, Number(PASSWORD_SALT_ROUNDS))
			: undefined;

		const player = await this.prismaService.player.update({
			where: { id },
			data: {
				...playerData,
				password: hashedSaltedPassword,
			},
		});

		return PlayersService.playerToPlayerFullData(player);
	}

	async deletePlayerById(id: string): Promise<ResPlayerFullDataDto> {
		const player = await this.prismaService.player.update({
			where: { id },
			data: {
				username: `deleted_${id}`,
				firstname: null,
				lastname: null,
				deletedAt: new Date(),
				groups: {
					updateMany: {
						where: { playerId: id },
						data: { active: false },
					},
				},
				eventsRefereed: {
					updateMany: {
						where: { playerId: id },
						data: { active: false },
					},
				},
			},
		});

		return PlayersService.playerToPlayerFullData(player);
	}

	async checkUsernameAvailableOrFail(
		username: string,
		currentUserId?: string,
	): Promise<void> {
		const player = await this.getPlayerByUsername(username);
		if (
			(currentUserId === undefined && player) ||
			username?.startsWith('deleted_') ||
			(player && player.id !== currentUserId)
		) {
			throw new ConflictException(
				'A player with the same username already exists',
				'PLAYER_ALREADY_EXISTS',
			);
		}
	}
}
