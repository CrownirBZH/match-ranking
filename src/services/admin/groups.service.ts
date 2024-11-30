import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqAdminGroupCreateBodyDto } from 'src/dtos/request/admin/groups/create.body.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqAdminGroupUpdateBodyDto } from 'src/dtos/request/admin/groups/update.body.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ResGroupFullDataDto } from 'src/dtos/response/groups/full-data.dto';
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
				players: { connect: body.players.map((id) => ({ id })) },
			},
			include: {
				players: {
					select: {
						id: true,
						username: true,
						firstname: true,
						lastname: true,
					},
				},
			},
		});

		return GroupsService.groupToGroupFullData(group);
	}

	async updateGroupById(
		id: string,
		body: ReqAdminGroupUpdateBodyDto,
	): Promise<ResGroupFullDataDto> {
		const playersUpdate = body.players
			? { players: { set: body.players.map((id) => ({ id })) } }
			: undefined;

		const group = await this.prismaService.group.update({
			where: { id },
			data: {
				...body,
				...playersUpdate,
			},
			include: { players: true },
		});

		return GroupsService.groupToGroupFullData(group);
	}

	async deleteGroupById(id: string): Promise<ResGroupFullDataDto> {
		const group = await this.prismaService.group.update({
			where: { id },
			data: {
				name: `deleted_${id}`,
				description: null,
				deletedAt: new Date(),
			},
			include: { players: true },
		});

		return GroupsService.groupToGroupFullData(group);
	}
}
