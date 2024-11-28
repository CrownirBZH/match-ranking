import { Transform } from 'class-transformer';
import {
	ValidateIf,
	type ValidationArguments,
	type ValidationOptions,
	registerDecorator,
} from 'class-validator';
import { DateTime } from 'luxon';

function validateISO8601(value: unknown): boolean {
	if (value instanceof DateTime) {
		const dateTimeValue = value as DateTime;
		return dateTimeValue.isValid && dateTimeValue.zoneName === 'UTC';
	}

	const iso8601FullRegex = /^\d+-\d+-\d+T\d+:\d+:\d+\.\d+Z$/;

	return (
		typeof value === 'string' &&
		iso8601FullRegex.test(value) &&
		DateTime.fromISO(value, { zone: 'UTC' }).isValid
	);
}

export function IsRequired(validationOptions?: ValidationOptions) {
	return (target: object, propertyName: string) => {
		registerDecorator({
			name: 'IsRequired',
			target: target.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: unknown) {
					return value !== undefined;
				},
				defaultMessage(args: ValidationArguments) {
					return `${args.property} is required`;
				},
			},
		});
	};
}

export function IsUTCDateTimeString(validationOptions?: ValidationOptions) {
	return (target: object, propertyName: string) => {
		registerDecorator({
			name: 'IsUTCDateTimeString',
			target: target.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: unknown) {
					return validateISO8601(value);
				},
				defaultMessage(args: ValidationArguments) {
					return `${args.property} must be a valid ISO 8601 UTC string in the format YYYY-MM-DDTHH:mm:ss.sssZ`;
				},
			},
		});
	};
}

export function IsNull(validationOptions?: ValidationOptions) {
	return (target: object, propertyName: string) => {
		registerDecorator({
			name: 'IsNull',
			target: target.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: unknown) {
					return value === null || value === undefined;
				},
				defaultMessage(args: ValidationArguments) {
					return `${args.property} must be null`;
				},
			},
		});
	};
}

export function IsOptional(validationOptions?: ValidationOptions) {
	return (target: object, propertyName: string) => {
		ValidateIf((_, value) => value !== undefined)(target, propertyName);
		registerDecorator({
			name: 'IsOptional',
			target: target.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate() {
					return true;
				},
			},
		});
	};
}

export function IsNullable(validationOptions?: ValidationOptions) {
	return (target: object, propertyName: string) => {
		ValidateIf((_, value) => value !== null)(target, propertyName);
		registerDecorator({
			name: 'IsNullable',
			target: target.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate() {
					return true;
				},
			},
		});
	};
}

export function DefaultValue(defaultValue: unknown) {
	return Transform(({ value }) => {
		return value === undefined ? defaultValue : value;
	});
}

export function ToDateTime() {
	return Transform(({ value }) => {
		if (validateISO8601(value))
			return DateTime.fromISO(value, { zone: 'UTC' });

		return value;
	});
}

export function ToNumber() {
	return Transform(({ value }) => {
		const parsed = Number(value);
		return Number.isNaN(parsed) ? value : parsed;
	});
}

export function ToBoolean() {
	return Transform(({ value }) => {
		if (value === 'true') return true;
		if (value === 'false') return false;
		return value;
	});
}
