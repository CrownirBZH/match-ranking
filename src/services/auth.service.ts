import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
// biome-ignore lint/style/useImportType: <explanation>
import { ResAuthLoginDto } from 'src/dtos/response/login.dto';
// biome-ignore lint/style/useImportType: <explanation>
import {
	EAccountType,
	EAuthMethod,
	IAuthDataToken,
	ICheckPasswordData,
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

	async passwordLoginOrFail(
		password: string,
		checkPasswordData: ICheckPasswordData,
		accountType: EAccountType,
	): Promise<ResAuthLoginDto> {
		let passwordValid = false;

		if (checkPasswordData) {
			passwordValid = await this.checkPassword(
				password,
				checkPasswordData.password,
			);
		}

		if (!checkPasswordData || !passwordValid)
			throw new NotFoundException(
				'The user was not found or the password is invalid',
				'USER_NOT_FOUND',
			);

		const token = await this.generateAccessToken(
			checkPasswordData.id,
			accountType,
			EAuthMethod.PASSWORD,
		);

		return { access_token: token };
	}
}
