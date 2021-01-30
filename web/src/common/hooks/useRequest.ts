import { useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

let baseURL = '';

export const setBaseURL = (a: string) => {
	baseURL = a;
};

interface UseRequestStates<P> {
	initial: boolean;
	loading: boolean;
	complete: boolean;
	error: any;
	value: P | null;
}

export const useRequest = <P = any>(
	endpoint: string,
	options: AxiosRequestConfig = { method: 'GET' }
) => {
	const [states, setStates] = useState<UseRequestStates<P>>({
		initial: true,
		loading: true,
		complete: false,
		error: null,
		value: null,
	});
	return {
		...states,
		call(otheroptions: AxiosRequestConfig) {
			setStates((prev) => ({
				...prev,
				loading: true,
				complete: false,
			}));
			return axios({
				url: `${baseURL}${endpoint}`,
				...options,
				...otheroptions,
			})
				.then((response) => {
					setStates((prev) => ({
						...prev,
						initial: false,
						loading: false,
						complete: true,
						value: response.data,
					}));
					return response;
				})
				.catch((error) => {
					setStates((prev) => ({
						...prev,
						initial: false,
						loading: false,
						complete: true,
						error: error.message,
					}));
				});
		},
	};
};
