import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { IsRequired } from 'src/decorators/dto.decorator';

export class ReqByIdParamDto {
	@IsRequired()
	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({
		required: true,
		type: String,
		description: 'The ressource ID',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	id: string;
}
