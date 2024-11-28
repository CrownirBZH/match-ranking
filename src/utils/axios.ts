import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import axios, {
	AxiosError,
	type AxiosResponse,
	type AxiosInstance,
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
		const axiosInstance = axios.create(config);

		axiosInstance.interceptors.request.use(
			Axios.handleRequest,
			Promise.reject,
		);

		axiosInstance.interceptors.response.use(
			Axios.handleResponse,
			Axios.handleResponse,
		);

		return axiosInstance;
	}

	private static handleRequest(
		request: ICustomAxiosRequestConfig,
	): ICustomAxiosRequestConfig {
		request.id = randomUUID();
		request.startTime = Date.now();
		request.headers['User-Agent'] ||= `${APP_TITLE}/${APP_VERSION}`;

		if (REQUEST_HTTP_PROXY_ENABLED === 'true')
			request.proxy = {
				host: REQUEST_HTTP_PROXY_HOST,
				port: Number(REQUEST_HTTP_PROXY_PORT),
			};

		return request;
	}

	private static handleResponse(
		result: AxiosResponse<unknown, ICustomAxiosRequestConfig> | AxiosError,
	) {
		const isError = result instanceof AxiosError;

		const config = result.config as ICustomAxiosRequestConfig;
		const headers = isError
			? (result as AxiosError)?.response?.headers
			: (result as AxiosResponse)?.headers;

		if (headers) Axios.addRequestDuration(config, headers);

		return isError ? Promise.reject(result) : result;
	}

	private static addRequestDuration(
		config?: ICustomAxiosRequestConfig,
		headers?: Record<string, unknown>,
	): void {
		if (config?.startTime && headers)
			headers['Request-Duration'] = String(Date.now() - config.startTime);
	}
}
