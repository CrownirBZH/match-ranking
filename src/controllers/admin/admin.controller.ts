import {
	ConflictException,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
	ValidatedBody,
	ValidatedParam,
	ValidatedQuery,
} from 'src/decorators/validation.decorator';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqAdminCreateBodyDto } from 'src/dtos/request/admin/create.body.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqAdminGetAllQueryDto } from 'src/dtos/request/admin/get-all.query.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqAdminUpdateBodyDto } from 'src/dtos/request/admin/update.body.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqByIdParamDto } from 'src/dtos/request/by-id.param.dto';
import { ResAdminFullDataDto } from 'src/dtos/response/admin/full-data.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { CurrentContext } from 'src/modules/current-context';
// biome-ignore lint/style/useImportType: <explanation>
import { AdminService } from 'src/services/admin/admin.service';
import { createContainerResponse } from 'src/utils/helper';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@Get()
	@ApiOperation({
		summary: 'Get all admin',
		description: 'Get all admin from the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'All admin were retrieved successfully',
		type: [ResAdminFullDataDto],
	})
	async getAll(
		@ValidatedQuery() query: ReqAdminGetAllQueryDto,
	): Promise<ResAdminFullDataDto[]> {
		const adminContainer = await this.adminService.getAllAdmin(query);

		return createContainerResponse(adminContainer) as ResAdminFullDataDto[];
	}

	@Post()
	@ApiOperation({
		summary: 'Add an admin',
		description: 'Add an admin to the database.',
	})
	@ApiResponse({
		status: 201,
		description: 'The admin was created successfully',
		type: ResAdminFullDataDto,
	})
	@ApiResponse({
		status: 409,
		description: 'An admin with the same username already exists',
	})
	async create(
		@ValidatedBody() body: ReqAdminCreateBodyDto,
	): Promise<ResAdminFullDataDto> {
		await this.checkAdminUsernameAvailableOrFail(body.username, undefined);

		return await this.adminService.createUser(body);
	}

	@Get(':id')
	@ApiOperation({
		summary: 'Get an admin by id',
		description: 'Get an admin by id from the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'The admin was retrieved successfully',
		type: ResAdminFullDataDto,
	})
	@ApiResponse({
		status: 404,
		description: 'The admin was not found',
	})
	async getById(
		@ValidatedParam() param: ReqByIdParamDto,
	): Promise<ResAdminFullDataDto> {
		return await this.getActiveAdminByIdOrFail(param.id);
	}

	@Patch(':id')
	@ApiOperation({
		summary: 'Update an admin by id',
		description: 'Update an admin by id in the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'The admin was updated successfully',
		type: ResAdminFullDataDto,
	})
	@ApiResponse({
		status: 404,
		description: 'The admin was not found',
	})
	@ApiResponse({
		status: 409,
		description: 'An admin with the same username already exists',
	})
	async updateById(
		@ValidatedParam() param: ReqByIdParamDto,
		@ValidatedBody() body: ReqAdminUpdateBodyDto,
	): Promise<ResAdminFullDataDto> {
		await this.getActiveAdminByIdOrFail(param.id);

		await this.checkAdminUsernameAvailableOrFail(body.username, param.id);

		return await this.adminService.updateAdminById(param.id, body);
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Delete an admin by id',
		description: 'Delete an admin by id from the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'The admin was deleted successfully',
		type: ResAdminFullDataDto,
	})
	@ApiResponse({
		status: 404,
		description: 'The admin was not found',
	})
	async deleteById(
		@ValidatedParam() param: ReqByIdParamDto,
	): Promise<ResAdminFullDataDto> {
		await this.getActiveAdminByIdOrFail(param.id);

		return await this.adminService.deleteAdminById(param.id);
	}

	@Get('me')
	@ApiOperation({
		summary: 'Get the current admin',
		description: 'Get the current admin from the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'The admin was retrieved successfully',
		type: ResAdminFullDataDto,
	})
	async getMe(): Promise<ResAdminFullDataDto> {
		const id = CurrentContext.auth.sub;

		return await this.adminService.getAdminById(id);
	}

	@Patch('me')
	@ApiOperation({
		summary: 'Update the current admin',
		description: 'Update the current admin in the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'The admin was updated successfully',
		type: ResAdminFullDataDto,
	})
	@ApiResponse({
		status: 409,
		description: 'An admin with the same username already exists',
	})
	async updateMe(
		@ValidatedBody() body: ReqAdminUpdateBodyDto,
	): Promise<ResAdminFullDataDto> {
		const id = CurrentContext.auth.sub;
		await this.checkAdminUsernameAvailableOrFail(body.username, id);

		return await this.adminService.updateAdminById(id, body);
	}

	@Delete('me')
	@ApiOperation({
		summary: 'Delete the current admin',
		description: 'Delete the current admin from the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'The admin was deleted successfully',
		type: ResAdminFullDataDto,
	})
	async deleteMe(): Promise<ResAdminFullDataDto> {
		const id = CurrentContext.auth.sub;

		return await this.adminService.deleteAdminById(id);
	}

	private async checkAdminUsernameAvailableOrFail(
		username: string,
		currentUserId: string,
	): Promise<void> {
		const admin = await this.adminService.getAdminByUsername(username);
		if (
			(currentUserId === undefined && admin) ||
			username?.startsWith('deleted_') ||
			(admin && admin.id !== currentUserId)
		) {
			throw new ConflictException(
				'An admin with the same username already exists',
				'ADMIN_ALREADY_EXISTS',
			);
		}
	}

	private async getActiveAdminByIdOrFail(
		id: string,
	): Promise<ResAdminFullDataDto> {
		const admin = await this.adminService.getAdminById(id);
		if (!admin || admin.deletedAt)
			throw new NotFoundException(
				`Admin with id '${id}' not found`,
				'ADMIN_NOT_FOUND',
			);

		return admin;
	}
}
