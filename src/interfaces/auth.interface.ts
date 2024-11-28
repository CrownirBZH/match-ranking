export interface IAuthDataToken {
	sub: string;
	accountType: EAccountType;
	authMethod: EAuthMethod;
}

export enum EAccountType {
	ADMIN = 'ADMIN',
	PLAYER = 'PLAYER',
}

export enum EAuthMethod {
	PASSWORD = 'PASSWORD',
	SESAME = 'SESAME',
}

export interface ICheckPasswordData {
	id: string;
	password: string;
}
