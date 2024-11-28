import type { InternalAxiosRequestConfig } from 'axios';

export interface ICustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	id?: string;
	startTime?: number;
}
