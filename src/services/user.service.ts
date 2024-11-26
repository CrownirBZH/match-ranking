import { Injectable } from '@nestjs/common';
import type { UserQueryDto } from 'src/dtos/user.query';

@Injectable()
export class UserService {
	async greetings(query: UserQueryDto): Promise<string> {
		return `Hello ${query.firstname} ${query.lastname}! You born on ${query.dob.toISO()}.`;
	}
}
