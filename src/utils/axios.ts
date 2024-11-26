import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import axios, {
	AxiosError,
	type AxiosResponse,
	type AxiosInstance,
	type CreateAxiosDefaults,
} from 'axios';
import type { CustomAxiosRequestConfig } from 'src/interfaces/axios.interface';
import { CurrentContext } from 'src/modules/current-context';

const {
	REQUEST_HTTP_USER_AGENT = 'API/1.0',
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
		request: CustomAxiosRequestConfig,
	): CustomAxiosRequestConfig {
		const controller = new AbortController();
		request.signal = controller.signal;
		request.id = randomUUID();
		request.startTime = Date.now();
		request.headers['User-Agent'] ||= REQUEST_HTTP_USER_AGENT;

		if (REQUEST_HTTP_PROXY_ENABLED === 'true') {
			request.proxy = {
				host: REQUEST_HTTP_PROXY_HOST,
				port: Number(REQUEST_HTTP_PROXY_PORT),
			};
		}

		CurrentContext.addRequest(request.id, controller);
		return request;
	}

	private static handleResponse(
		result: AxiosResponse<unknown, CustomAxiosRequestConfig> | AxiosError,
	) {
		const isError = result instanceof AxiosError;

		const config = result.config as CustomAxiosRequestConfig;
		const headers = isError
			? (result as AxiosError)?.response?.headers
			: (result as AxiosResponse)?.headers;

		Axios.cleanupRequest(config.id);
		if (headers) Axios.addRequestDuration(config, headers);

		if (
			isError &&
			result.code === AxiosError.ERR_CANCELED &&
			result.message === 'canceled' &&
			!CurrentContext.active
		) {
			// Request was aborted by the client
			//console.debug(
			//	`[${CurrentContext.req.id}] Aborting request [${config.id}]...`,
			//);
			return;
		}

		return isError ? Promise.reject(result) : result;
	}

	private static addRequestDuration(
		config?: CustomAxiosRequestConfig,
		headers?: Record<string, unknown>,
	): void {
		if (config?.startTime && headers)
			headers['Request-Duration'] = String(Date.now() - config.startTime);
	}

	private static cleanupRequest(requestId?: string): void {
		if (requestId) CurrentContext.removeRequest(requestId);
	}
}
