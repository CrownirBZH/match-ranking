import { ConflictException, Injectable } from '@nestjs/common';
import type { Admin } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import type { ReqAdminCreateBodyDto } from 'src/dtos/request/admin/create.body.dto';
import type { ReqAdminGetAllQueryDto } from 'src/dtos/request/admin/get-all.query.dto';
import type { ReqAdminUpdateBodyDto } from 'src/dtos/request/admin/update.body.dto';
import type { ResAdminFullDataDto } from 'src/dtos/response/admin/full-data.dto';
import type { IAdminContainer } from 'src/interfaces/admin/admin.interface';
import { EAccountStatusFilter } from 'src/interfaces/common.interface';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/modules/prisma';

const { PASSWORD_SALT_ROUNDS = '10' } = process.env;

@Injectable()
export class AdminService {
	constructor(private readonly prismaService: PrismaService) {}

	static adminToAdminFullData(admin: Admin): ResAdminFullDataDto {
		return {
			id: admin.id,
			username: admin.username,
			sesame: {
				linked: !!admin.sesameId,
				id: admin.sesameId,
				linkedAt: admin.sesameLinkedAt,
			},
			firstname: admin.firstname,
			lastname: admin.lastname,
			createdAt: admin.createdAt,
			updatedAt: admin.updatedAt,
			deletedAt: admin.deletedAt,
		};
	}

	async usernameAlreadyExists(username: string): Promise<boolean> {
		const admin = await this.prismaService.admin.findUnique({
			where: { username },
			select: { id: true },
		});

		return !!admin;
	}

	async createUser(
		body: ReqAdminCreateBodyDto,
	): Promise<ResAdminFullDataDto> {
		const hashedSaltedPassword = await bcrypt.hash(
			body.password,
			Number(PASSWORD_SALT_ROUNDS),
		);

		const admin = await this.prismaService.admin.create({
			data: {
				...body,
				password: hashedSaltedPassword,
			},
		});

		return AdminService.adminToAdminFullData(admin);
	}

	async getAdminById(id: string): Promise<ResAdminFullDataDto> {
		const admin = await this.prismaService.admin.findUnique({
			where: { id },
		});
		if (!admin) return null;

		return AdminService.adminToAdminFullData(admin);
	}

	async updateAdminById(
		id: string,
		body: ReqAdminUpdateBodyDto,
	): Promise<ResAdminFullDataDto> {
		const { password, sesame, ...adminData } = body;

		const hashedSaltedPassword = password
			? await bcrypt.hash(password, Number(PASSWORD_SALT_ROUNDS))
			: undefined;

		const sesameObject =
			sesame === null ? { sesameId: null, sesameLinkedAt: null } : {};

		const admin = await this.prismaService.admin.update({
			where: { id },
			data: {
				...adminData,
				...sesameObject,
				password: hashedSaltedPassword,
			},
		});

		return AdminService.adminToAdminFullData(admin);
	}

	async getAdminByUsername(username: string): Promise<ResAdminFullDataDto> {
		const admin = await this.prismaService.admin.findUnique({
			where: { username },
		});
		if (!admin) return null;

		return AdminService.adminToAdminFullData(admin);
	}

	async deleteAdminById(id: string): Promise<ResAdminFullDataDto> {
		const admin = await this.prismaService.admin.update({
			where: { id },
			data: {
				username: `deleted_${id}`,
				sesameId: null,
				sesameLinkedAt: null,
				firstname: null,
				lastname: null,
				deletedAt: new Date(),
			},
		});

		return AdminService.adminToAdminFullData(admin);
	}

	async getAllAdmin(query: ReqAdminGetAllQueryDto): Promise<IAdminContainer> {
		const { sortType, sortColumn, page, limit, status } = query;

		const offset = (page - 1) * limit;

		const whereClause =
			status === EAccountStatusFilter.ALL
				? {}
				: status === EAccountStatusFilter.ACTIVE
					? { deletedAt: null }
					: { deletedAt: { not: null } };

		const totalCount = await this.prismaService.admin.count({
			where: whereClause,
		});

		const totalPages = Math.ceil(totalCount / limit);

		const admin = await this.prismaService.admin.findMany({
			where: whereClause,
			orderBy: {
				[sortColumn]: sortType,
			},
			skip: offset,
			take: limit,
		});

		return {
			admin: admin.map(AdminService.adminToAdminFullData),
			totalCount,
			totalPages,
			page,
			limit,
		};
	}

	async usernameAvailableOrFail(
		username: string,
		currentUserId: string,
	): Promise<void> {
		const admin = await this.getAdminByUsername(username);
		if (
			(currentUserId === undefined && admin) ||
			username.startsWith('deleted_') ||
			(admin && admin.id !== currentUserId)
		) {
			throw new ConflictException(
				'An admin with the same username already exists',
				'ADMIN_USERNAME_ALREADY_EXISTS',
			);
		}
	}
}
