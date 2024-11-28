import {
	Body,
	Param,
	Query,
	ValidationPipe,
	type ValidationPipeOptions,
} from '@nestjs/common';

function createValidationDecorator(
	decoratorFactory: (pipe: ValidationPipe) => ParameterDecorator,
): (options?: ValidationPipeOptions) => ParameterDecorator {
	return (options: ValidationPipeOptions = {}) => {
		const finalOptions = {
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
			...options,
		};

		const decorator = decoratorFactory(new ValidationPipe(finalOptions));

		return (
			target: unknown,
			propertyKey: string | symbol,
			parameterIndex: number,
		) => decorator(target, propertyKey, parameterIndex);
	};
}

export const ValidatedQuery = createValidationDecorator(Query);
export const ValidatedBody = createValidationDecorator(Body);
export const ValidatedParam = createValidationDecorator(Param);
