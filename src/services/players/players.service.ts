import { ConflictException, Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { Admin, Player } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import type { ReqPlayerUpdateBodyDto } from 'src/dtos/request/players/update.body.dto';
import type { ResPlayerFullDataDto } from 'src/dtos/response/players/full-data.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/modules/prisma';

const { PASSWORD_SALT_ROUNDS = '10' } = process.env;

@Injectable()
export class PlayersService {
	constructor(private readonly prismaService: PrismaService) {}

	static playerToPlayerFullData(
		player: Player & { adminValidator: Admin },
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
			createdAt: player.createdAt,
			updatedAt: player.updatedAt,
			deletedAt: player.deletedAt,
		};
	}

	async getPlayerById(id: string): Promise<ResPlayerFullDataDto> {
		const player = await this.prismaService.player.findUnique({
			where: { id },
			include: {
				adminValidator: true,
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
			include: { adminValidator: true },
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
			include: { adminValidator: true },
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
				'PLAYER_USERNAME_ALREADY_EXISTS',
			);
		}
	}
}
