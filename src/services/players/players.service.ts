import { ConflictException, Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { Admin, Group, Player } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import type { ReqPlayerUpdateBodyDto } from 'src/dtos/request/players/update.body.dto';
import type { ResPlayerFullDataDto } from 'src/dtos/response/players/full-data.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ResPlayerShortDataDto } from 'src/dtos/response/players/short-data.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/modules/prisma';
import { extractTimestampFromUUIDv7 } from 'src/utils/helper';
import { GroupsService } from '../groups.service';

const { PASSWORD_SALT_ROUNDS = '10' } = process.env;

@Injectable()
export class PlayersService {
	constructor(private readonly prismaService: PrismaService) {}

	static playerToPlayerFullData(
		player: Player & { adminValidator: Admin; groups: Partial<Group>[] },
	): ResPlayerFullDataDto {
		return {
			id: player.id,
			username: player.username,
			sesame: {
				linked: !!player.sesameId,
				id: player.sesameId,
				linkedAt: player.sesameLinkedAt,
			},
			firstname: player.firstname,
			lastname: player.lastname,
			validationStatus: {
				validated: !!player.accountValidatedAt,
				adminValidator: player.accountValidatedBy
					? {
							id: player.adminValidator.id,
							firstname: player.adminValidator.firstname,
							lastname: player.adminValidator.lastname,
						}
					: null,
				validatedAt: player.accountValidatedAt,
			},
			groups: player.groups.map(GroupsService.groupToGroupShortData),
			createdAt: extractTimestampFromUUIDv7(player.id),
			updatedAt: player.updatedAt,
			deletedAt: player.deletedAt,
		};
	}

	static playerToPlayerShortData(player: Player): ResPlayerShortDataDto {
		return {
			id: player.id,
			username: player.username,
			firstname: player.firstname,
			lastname: player.lastname,
		};
	}

	async getPlayersNotInList(ids: string[]): Promise<string[]> {
		const players = await this.prismaService.player.findMany({
			where: { id: { in: ids } },
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
		if (!player) return null;

		return PlayersService.playerToPlayerFullData(player);
	}

	async getPlayerByUsername(username: string): Promise<ResPlayerFullDataDto> {
		if (!username) return null;
		const player = await this.prismaService.player.findUnique({
			where: { username },
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
		if (!player) return null;

		return PlayersService.playerToPlayerFullData(player);
	}

	async updatePlayerById(
		id: string,
		body: ReqPlayerUpdateBodyDto,
	): Promise<ResPlayerFullDataDto> {
		const { password, sesame, ...playerData } = body;

		const hashedSaltedPassword = password
			? await bcrypt.hash(password, Number(PASSWORD_SALT_ROUNDS))
			: undefined;

		const sesameObject =
			sesame === null ? { sesameId: null, sesameLinkedAt: null } : {};

		const player = await this.prismaService.player.update({
			where: { id },
			data: {
				...playerData,
				...sesameObject,
				password: hashedSaltedPassword,
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

	async deletePlayerById(id: string): Promise<ResPlayerFullDataDto> {
		const player = await this.prismaService.player.update({
			where: { id },
			data: {
				username: `deleted_${id}`,
				sesameId: null,
				sesameLinkedAt: null,
				firstname: null,
				lastname: null,
				deletedAt: new Date(),
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

	async usernameAvailableOrFail(
		username: string,
		currentUserId: string,
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
