import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import axios, {
	AxiosError,
	type AxiosInstance,
	type AxiosResponse,
	type CreateAxiosDefaults,
} from 'axios';
import type { ICustomAxiosRequestConfig } from 'src/interfaces/axios.interface';

const {
	APP_TITLE = 'match-ranking',
	APP_VERSION = '1.0.0',
	REQUEST_HTTP_PROXY_ENABLED = 'false',
	REQUEST_HTTP_PROXY_HOST = 'localhost',
	REQUEST_HTTP_PROXY_PORT = '8888',
} = process.env;

@Injectable()
export class Axios {
	static create(config?: CreateAxiosDefaults): AxiosInstance {
		const instance = axios.create(config);

		instance.interceptors.request.use(Axios.handleRequest, Promise.reject);
		instance.interceptors.response.use(
			Axios.handleResponse,
			Axios.handleResponse,
		);

		return instance;
	}

	private static handleRequest(
		config: ICustomAxiosRequestConfig,
	): ICustomAxiosRequestConfig {
		config.id = randomUUID();
		config.startTime = Date.now();
		config.headers['User-Agent'] ||= `${APP_TITLE}/${APP_VERSION}`;

		if (REQUEST_HTTP_PROXY_ENABLED === 'true')
			config.proxy = {
				host: REQUEST_HTTP_PROXY_HOST,
				port: Number(REQUEST_HTTP_PROXY_PORT),
			};

		return config;
	}

	private static handleResponse(responseOrError: AxiosResponse | AxiosError) {
		const isError = responseOrError instanceof AxiosError;
		const config = responseOrError.config as ICustomAxiosRequestConfig;

		if (config?.startTime) {
			const headers = isError
				? responseOrError.response?.headers
				: responseOrError.headers;
			if (headers)
				headers['Request-Duration'] = String(
					Date.now() - config.startTime,
				);
		}

		return isError ? Promise.reject(responseOrError) : responseOrError;
	}
}
