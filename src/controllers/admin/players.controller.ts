import {
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
import { ReqAdminPlayerCreateBodyDto } from 'src/dtos/request/admin/players/create.body.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqAdminPlayerGetAllQueryDto } from 'src/dtos/request/admin/players/get-all.query.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqByIdParamDto } from 'src/dtos/request/by-id.param.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqPlayerUpdateBodyDto } from 'src/dtos/request/players/update.body.dto';
import { ResPlayerFullDataDto } from 'src/dtos/response/players/full-data.dto';
import { AdminGuard } from 'src/guards/admin.guard';
// biome-ignore lint/style/useImportType: <explanation>
import { AdminPlayersService } from 'src/services/admin/players.service';
// biome-ignore lint/style/useImportType: <explanation>
import { PlayersService } from 'src/services/players/players.service';
import { createContainerResponse } from 'src/utils/helper';

@ApiTags('Admin/Players')
@Controller('admin/players')
@UseGuards(AdminGuard)
export class AdminPlayersController {
	constructor(
		private readonly adminPlayersService: AdminPlayersService,
		private readonly playersService: PlayersService,
	) {}

	@Get()
	@ApiOperation({
		summary: 'Get all players',
		description: 'Get all players from the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'All players were retrieved successfully',
		type: [ResPlayerFullDataDto],
	})
	async getAll(
		@ValidatedQuery() query: ReqAdminPlayerGetAllQueryDto,
	): Promise<ResPlayerFullDataDto[]> {
		const playersContainer =
			await this.adminPlayersService.getAllPlayers(query);

		return createContainerResponse(
			playersContainer,
		) as ResPlayerFullDataDto[];
	}

	@Post()
	@ApiOperation({
		summary: 'Add a player',
		description: 'Add a player to the database.',
	})
	@ApiResponse({
		status: 201,
		description: 'The player was created successfully',
		type: ResPlayerFullDataDto,
	})
	@ApiResponse({
		status: 409,
		description: 'A player with the same username already exists',
	})
	async create(
		@ValidatedBody() body: ReqAdminPlayerCreateBodyDto,
	): Promise<ResPlayerFullDataDto> {
		await this.playersService.checkUsernameAvailableOrFail(body.username);

		return await this.adminPlayersService.createPlayer(body);
	}

	@Get(':id')
	@ApiOperation({
		summary: 'Get a player by id',
		description: 'Get a player by id from the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'The player was retrieved successfully',
		type: ResPlayerFullDataDto,
	})
	@ApiResponse({
		status: 404,
		description: 'The player was not found',
	})
	async getById(
		@ValidatedParam() param: ReqByIdParamDto,
	): Promise<ResPlayerFullDataDto> {
		return await this.getActivePlayerByIdOrFail(param.id);
	}

	@Patch(':id')
	@ApiOperation({
		summary: 'Update a player by id',
		description: 'Update a player by id in the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'The player was updated successfully',
		type: ResPlayerFullDataDto,
	})
	@ApiResponse({
		status: 404,
		description: 'The player was not found',
	})
	@ApiResponse({
		status: 409,
		description: 'A player with the same username already exists',
	})
	async updateById(
		@ValidatedParam() param: ReqByIdParamDto,
		@ValidatedBody() body: ReqPlayerUpdateBodyDto,
	): Promise<ResPlayerFullDataDto> {
		await this.getActivePlayerByIdOrFail(param.id);

		await this.playersService.checkUsernameAvailableOrFail(
			body.username,
			param.id,
		);

		return await this.playersService.updatePlayerById(param.id, body);
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Delete a player by id',
		description: 'Delete a player by id from the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'The player was deleted successfully',
		type: ResPlayerFullDataDto,
	})
	@ApiResponse({
		status: 404,
		description: 'The player was not found',
	})
	async deleteById(
		@ValidatedParam() param: ReqByIdParamDto,
	): Promise<ResPlayerFullDataDto> {
		await this.getActivePlayerByIdOrFail(param.id);

		return await this.playersService.deletePlayerById(param.id);
	}

	private async getActivePlayerByIdOrFail(
		id: string,
	): Promise<ResPlayerFullDataDto> {
		const player = await this.playersService.getPlayerById(id);
		if (!player || player.deletedAt)
			throw new NotFoundException(
				`Player with id '${id}' not found`,
				'PLAYER_NOT_FOUND',
			);

		return player;
	}
}
