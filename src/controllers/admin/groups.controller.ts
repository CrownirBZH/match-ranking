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
import { ReqAdminEventCreateBodyDto } from 'src/dtos/request/admin/events/create.body.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqAdminGroupCreateBodyDto } from 'src/dtos/request/admin/groups/create.body.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqAdminGroupUpdateBodyDto } from 'src/dtos/request/admin/groups/update.body.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqByIdParamDto } from 'src/dtos/request/by-id.param.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqEventsByGroupGetAllQueryDto } from 'src/dtos/request/events/get-all.query.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqGroupGetAllQueryDto } from 'src/dtos/request/groups/get-all.query.dto';
import { ResEventFullDataDto } from 'src/dtos/response/events/full-data.dto';
import { ResEventLessDataDto } from 'src/dtos/response/events/less-data.dto';
import { ResGroupFullDataDto } from 'src/dtos/response/groups/full-data.dto';
import { AdminGuard } from 'src/guards/admin.guard';
// biome-ignore lint/style/useImportType: <explanation>
import { AdminGroupsService } from 'src/services/admin/groups.service';
// biome-ignore lint/style/useImportType: <explanation>
import { EventsService } from 'src/services/events.service';
// biome-ignore lint/style/useImportType: <explanation>
import { GroupsService } from 'src/services/groups.service';
// biome-ignore lint/style/useImportType: <explanation>
import { PlayersService } from 'src/services/players/players.service';
import { createContainerResponse } from 'src/utils/helper';

@ApiTags('Admin/Groups')
@Controller('admin/groups')
@UseGuards(AdminGuard)
export class AdminGroupsController {
	constructor(
		private readonly adminGroupsService: AdminGroupsService,
		private readonly groupsService: GroupsService,
		private readonly playersService: PlayersService,
		private readonly eventsService: EventsService,
	) {}

	@Get()
	@ApiOperation({
		summary: 'Get all groups',
		description: 'Get all groups from the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'All groups were retrieved successfully',
		type: [ResGroupFullDataDto],
	})
	async getAll(
		@ValidatedQuery() query: ReqGroupGetAllQueryDto,
	): Promise<ResGroupFullDataDto[]> {
		const groupsContainer = await this.groupsService.getAllGroups(query);

		return createContainerResponse(
			groupsContainer,
		) as ResGroupFullDataDto[];
	}

	@Post()
	@ApiOperation({
		summary: 'Add a group',
		description: 'Add a group to the database.',
	})
	@ApiResponse({
		status: 201,
		description: 'The group was created successfully',
		type: ResGroupFullDataDto,
	})
	@ApiResponse({
		status: 409,
		description: 'A group with the same name already exists',
	})
	async create(
		@ValidatedBody() body: ReqAdminGroupCreateBodyDto,
	): Promise<ResGroupFullDataDto> {
		await this.checkGroupNameAvailableOrFail(body.name);
		await this.checkPlayersExistsOrFail(body.players);

		return await this.adminGroupsService.createGroup(body);
	}

	@Get(':id')
	@ApiOperation({
		summary: 'Get a group by id',
		description: 'Get a group by id from the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'The group was retrieved successfully',
		type: ResGroupFullDataDto,
	})
	@ApiResponse({
		status: 404,
		description: 'The group was not found',
	})
	async getById(
		@ValidatedParam() param: ReqByIdParamDto,
	): Promise<ResGroupFullDataDto> {
		return await this.groupsService.getActiveGroupByIdOrFail(param.id);
	}

	@Patch(':id')
	@ApiOperation({
		summary: 'Update a group by id',
		description: 'Update a group by id in the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'The group was updated successfully',
		type: ResGroupFullDataDto,
	})
	@ApiResponse({
		status: 404,
		description: 'The group was not found',
	})
	@ApiResponse({
		status: 409,
		description: 'A group with the same name already exists',
	})
	async updateById(
		@ValidatedParam() param: ReqByIdParamDto,
		@ValidatedBody() body: ReqAdminGroupUpdateBodyDto,
	): Promise<ResGroupFullDataDto> {
		await this.groupsService.getActiveGroupByIdOrFail(param.id);

		await this.checkGroupNameAvailableOrFail(body.name, param.id);
		await this.checkPlayersExistsOrFail(body.players);

		return await this.adminGroupsService.updateGroupById(param.id, body);
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Delete a group by id',
		description: 'Delete a group by id from the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'The group was deleted successfully',
		type: ResGroupFullDataDto,
	})
	@ApiResponse({
		status: 404,
		description: 'The group was not found',
	})
	async deleteById(
		@ValidatedParam() param: ReqByIdParamDto,
	): Promise<ResGroupFullDataDto> {
		await this.groupsService.getActiveGroupByIdOrFail(param.id);

		return await this.adminGroupsService.deleteGroupById(param.id);
	}

	@Get(':id/events')
	@ApiOperation({
		summary: 'Get all events related to a group',
		description: 'Get all events related to a group from the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'All events were retrieved successfully',
		type: [ResEventLessDataDto],
	})
	@ApiResponse({
		status: 404,
		description: 'The group was not found',
	})
	async getEvents(
		@ValidatedParam() param: ReqByIdParamDto,
		@ValidatedQuery() query: ReqEventsByGroupGetAllQueryDto,
	): Promise<ResEventLessDataDto[]> {
		await this.groupsService.getActiveGroupByIdOrFail(param.id);

		const eventsContainer = await this.eventsService.getAllEventsByGroupId(
			param.id,
			query,
		);

		return createContainerResponse(
			eventsContainer,
		) as ResEventLessDataDto[];
	}

	@Post(':id/events')
	@ApiOperation({
		summary: 'Create an event related to a group',
		description: 'Create an event related to a group.',
	})
	@ApiResponse({
		status: 201,
		description: 'The event was created successfully',
		type: ResEventFullDataDto,
	})
	@ApiResponse({
		status: 404,
		description: 'The group was not found',
	})
	@ApiResponse({
		status: 409,
		description: 'An event with the same name already exists',
	})
	async createEvent(
		@ValidatedParam() param: ReqByIdParamDto,
		@ValidatedBody() body: ReqAdminEventCreateBodyDto,
	): Promise<unknown> {
		await this.groupsService.getActiveGroupByIdOrFail(param.id);
		await this.eventsService.isEventNameAvailableOrFail(body.name);

		return this.eventsService.createEvent(param.id, body);
	}

	private async checkGroupNameAvailableOrFail(
		name: string,
		currentGroupId?: string,
	): Promise<void> {
		const group = await this.groupsService.getGroupByName(name);
		if (
			(currentGroupId === undefined && group) ||
			name?.startsWith('deleted_') ||
			(group && group.id !== currentGroupId)
		) {
			throw new ConflictException(
				'A group with the same name already exists',
				'GROUP_ALREADY_EXISTS',
			);
		}
	}

	private async checkPlayersExistsOrFail(players: string[]): Promise<void> {
		const playersNotInList =
			await this.playersService.getPlayersNotInList(players);
		if (playersNotInList.length > 0)
			throw new NotFoundException(
				`Players [${playersNotInList.join(', ')}] not found`,
				'PLAYER_NOT_FOUND',
			);
	}
}
