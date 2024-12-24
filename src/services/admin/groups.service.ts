import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqAdminGroupCreateBodyDto } from 'src/dtos/request/admin/groups/create.body.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqAdminGroupUpdateBodyDto } from 'src/dtos/request/admin/groups/update.body.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ResGroupFullDataDto } from 'src/dtos/response/groups/full-data.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { TGroupWithUsers } from 'src/interfaces/groups.interface';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/modules/prisma';
import { GroupsService } from '../groups.service';

@Injectable()
export class AdminGroupsService {
	constructor(private readonly prismaService: PrismaService) {}

	async createGroup(
		body: ReqAdminGroupCreateBodyDto,
	): Promise<ResGroupFullDataDto> {
		const group = await this.prismaService.group.create({
			data: {
				...body,
				players: {
					createMany: {
						data: body.players.map((playerId) => ({
							playerId,
						})),
					},
				},
			},
			include: GroupsService.groupActiveInclude,
		});

		return GroupsService.groupToGroupFullData(
			group as unknown as TGroupWithUsers,
		);
	}

	async updateGroupById(
		id: string,
		body: ReqAdminGroupUpdateBodyDto,
	): Promise<ResGroupFullDataDto> {
		const updatedPlayers = body.players;

		let playersToAdd = [];
		let playersToReactivate = [];
		let playersToDeactivate = [];

		if (updatedPlayers !== undefined) {
			const currentPlayers =
				await this.prismaService.groupPlayer.findMany({
					where: { groupId: id },
					select: { playerId: true, active: true },
				});

			const currentPlayerIds = currentPlayers.map((p) => p.playerId);
			const inactivePlayerIds = currentPlayers
				.filter((p) => !p.active)
				.map((p) => p.playerId);

			playersToAdd = updatedPlayers.filter(
				(playerId) => !currentPlayerIds.includes(playerId),
			);
			playersToReactivate = updatedPlayers.filter((playerId) =>
				inactivePlayerIds.includes(playerId),
			);
			playersToDeactivate = currentPlayerIds.filter(
				(playerId) => !updatedPlayers.includes(playerId),
			);
		}

		const group = await this.prismaService.group.update({
			where: { id },
			data: {
				...body,
				players:
					updatedPlayers !== undefined
						? {
								updateMany: [
									// Deactivate players
									...playersToDeactivate.map((playerId) => ({
										where: { playerId, groupId: id },
										data: { active: false },
									})),
									// Reactivate players
									...playersToReactivate.map((playerId) => ({
										where: { playerId, groupId: id },
										data: { active: true },
									})),
								],
								createMany: {
									// Add new players
									data: playersToAdd.map((playerId) => ({
										playerId,
									})),
								},
							}
						: undefined,
			},
			include: GroupsService.groupActiveInclude,
		});

		return GroupsService.groupToGroupFullData(
			group as unknown as TGroupWithUsers,
		);
	}

	async deleteGroupById(id: string): Promise<ResGroupFullDataDto> {
		const group = await this.prismaService.group.update({
			where: { id },
			data: {
				name: `deleted_${id}`,
				description: null,
				deletedAt: new Date(),
				players: {
					updateMany: {
						where: { groupId: id },
						data: { active: false },
					},
				},
			},
			include: GroupsService.groupActiveInclude,
		});

		return GroupsService.groupToGroupFullData(
			group as unknown as TGroupWithUsers,
		);
	}
}
