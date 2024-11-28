import { Injectable } from '@nestjs/common';
import type { ICheckPasswordData } from 'src/interfaces/auth.interface';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/modules/prisma';

@Injectable()
export class PlayersAuthService {
	constructor(private readonly prismaService: PrismaService) {}

	async getPlayerCheckPasswordData(
		username: string,
	): Promise<ICheckPasswordData> {
		return await this.prismaService.player.findUnique({
			where: { username },
			select: { id: true, password: true },
		});
	}
}
