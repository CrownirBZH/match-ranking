import { Injectable } from '@nestjs/common';
import type { ICheckPasswordData } from 'src/interfaces/auth.interface';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/modules/prisma';

@Injectable()
export class AdminAuthService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAdminCheckPasswordData(
		username: string,
	): Promise<ICheckPasswordData> {
		return await this.prismaService.admin.findUnique({
			where: { username },
			select: { id: true, password: true },
		});
	}
}
