import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import type {
	EAccountType,
	EAuthMethod,
	IAuthDataToken,
} from 'src/interfaces/auth.interface';

const { JWT_VALIDITY = '2h' } = process.env;
const JWT_PRIVATE_KEY = (process.env.JWT_PRIVATE_KEY || '').replace(
	/\\n/g,
	'\n',
);
const JWT_PUBLIC_KEY = (process.env.JWT_PUBLIC_KEY || '').replace(/\\n/g, '\n');

@Injectable()
export class AuthService {
	async checkPassword(
		password: string,
		hashedSaltedPassword: string,
	): Promise<boolean> {
		return await bcrypt.compare(password, hashedSaltedPassword);
	}

	async getAuthDataFromToken(accessToken: string): Promise<IAuthDataToken> {
		try {
			return jwt.verify(accessToken, JWT_PUBLIC_KEY) as IAuthDataToken;
		} catch {
			return null;
		}
	}

	async generateAccessToken(
		userId: string,
		accountType: EAccountType,
		authMethod: EAuthMethod,
	): Promise<string> {
		const payload: IAuthDataToken = {
			sub: userId,
			accountType,
			authMethod,
		};

		return jwt.sign(payload, JWT_PRIVATE_KEY, {
			expiresIn: JWT_VALIDITY,
			algorithm: 'RS256',
		});
	}
}
