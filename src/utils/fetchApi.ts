import { useAuthStore } from '@stores/auth.store';
import { BASE_API_URL } from '@utils/constants';

export enum EFetchTypes {
	ALL = 'ALL',
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	PATCH = 'PATCH',
	UPDATE = 'UPDATE',
	OPTIONS = 'OPTIONS',
	DELETE = 'DELETE'
}

export type TFetchTypes = `${EFetchTypes}`;

// const isTokenExpiredBuffer = (token: string) => Date.now() >= JSON.parse(Buffer.from(token?.split?.('.')?.[1], 'base64').toString()).exp * 1000;
// const isTokenExpiredAtob = (token: string) => Date.now() >= JSON.parse(atob(token?.split?.('.')?.[1])).exp * 1000;

export async function postData(url = '', data = {}) {
	// Default options are marked with *
	const response = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(data) // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
}

// Helper Functions
function authHeader(url: string): HeadersInit {
	// return auth header with jwt if user is logged in and request is to the api url
	const { user } = useAuthStore();
	const isLoggedIn = !!user?.jwtToken;
	const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);
	if (isLoggedIn && isApiUrl) return { Authorization: `Bearer ${user.jwtToken}` } as HeadersInit;
	else return {} satisfies HeadersInit;
}

function handleResponse(response: Response) {
	return response.text().then((text) => {
		const data = text && JSON.parse(text);

		if (!response.ok) {
			const { user, logout } = useAuthStore();
			if ([401, 403].includes(response.status) && user) {
				// auto logout if 401 Unauthorized or 403 Forbidden response returned from api
				logout();
			}

			const error = (data && data.message) || response.statusText;
			return Promise.reject(error);
		}

		return data;
	});
}

function request(method: TFetchTypes) {
	return (url: string = BASE_API_URL, body: BodyInit | any | null | undefined, { credentials }: Omit<RequestInit, 'body'> = {}) => {
		const requestOptions: RequestInit | undefined = { method, headers: authHeader(url) };

		if (body) {
			requestOptions.headers = { ...requestOptions.headers, 'Content-Type': 'application/json' } as HeadersInit;
			requestOptions.body = JSON.stringify(body);
		}

		if (credentials) requestOptions.headers = { ...requestOptions.headers, credentials: credentials } as HeadersInit;

		return fetch(url, requestOptions).then(handleResponse);
	};
}

export const fetchWrapper = {
	get: request('GET'),
	post: request('POST'),
	put: request('PUT'),
	delete: request('DELETE')
};

export default fetchWrapper;