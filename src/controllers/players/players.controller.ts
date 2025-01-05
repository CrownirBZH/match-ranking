import { Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidatedBody } from 'src/decorators/validation.decorator';
// biome-ignore lint/style/useImportType: <explanation>
import { ReqPlayerUpdateBodyDto } from 'src/dtos/request/players/update.body.dto';
import { ResGroupFullDataDto } from 'src/dtos/response/groups/full-data.dto';
import { ResPlayerFullDataDto } from 'src/dtos/response/players/full-data.dto';
import { PlayerGuard } from 'src/guards/player.guard';
import { Context } from 'src/modules/context';
// biome-ignore lint/style/useImportType: <explanation>
import { GroupsService } from 'src/services/groups.service';
// biome-ignore lint/style/useImportType: <explanation>
import { PlayersService } from 'src/services/players/players.service';

@ApiTags('Players')
@Controller('players')
@UseGuards(PlayerGuard)
export class PlayersController {
	constructor(
		private readonly playersService: PlayersService,
		private readonly groupsService: GroupsService,
	) {}

	@Get('me')
	@ApiOperation({
		summary: 'Get the current player',
		description: 'Get the current player from the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'The player was retrieved successfully',
		type: ResPlayerFullDataDto,
	})
	async getMe(): Promise<ResPlayerFullDataDto> {
		const id = Context.auth.sub;

		return await this.playersService.getPlayerById(id);
	}

	@Patch('me')
	@ApiOperation({
		summary: 'Update the current player',
		description: 'Update the current player in the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'The player was updated successfully',
		type: ResPlayerFullDataDto,
	})
	@ApiResponse({
		status: 409,
		description: 'A player with the same username already exists',
	})
	async updateMe(
		@ValidatedBody() body: ReqPlayerUpdateBodyDto,
	): Promise<ResPlayerFullDataDto> {
		const id = Context.auth.sub;
		await this.playersService.checkUsernameAvailableOrFail(
			body.username,
			id,
		);

		return await this.playersService.updatePlayerById(id, body);
	}

	@Delete('me')
	@ApiOperation({
		summary: 'Delete the current player',
		description: 'Delete the current player from the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'The player was deleted successfully',
		type: ResPlayerFullDataDto,
	})
	async deleteMe(): Promise<ResPlayerFullDataDto> {
		const id = Context.auth.sub;

		return await this.playersService.deletePlayerById(id);
	}

	@Get('me/groups')
	@ApiOperation({
		summary: 'Get the groups of the current player',
		description: 'Get the groups of the current player from the database.',
	})
	@ApiResponse({
		status: 200,
		description: 'The groups were retrieved successfully',
		type: ResGroupFullDataDto,
	})
	async getMeGroups(): Promise<ResGroupFullDataDto[]> {
		const id = Context.auth.sub;

		return await this.groupsService.getActiveGroupsByPlayerId(id);
	}
}
