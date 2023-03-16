import axios, { AxiosInstance } from 'axios';
export type { CancelToken, isCancel, AxiosError } from 'axios';
import { BASE_API_URL } from '@utils/constants';
import { getLS, getLSWithParse, setLSWithModel, setLSWithStringfyForData } from '@src/composables/local-storage';

const axiosInstance: AxiosInstance = axios.create({ baseURL: BASE_API_URL, headers: { 'Content-type': 'application/json' } });

function refreshToken() {
	const user = getLSWithParse('user');
	// ! Todo: Buradaki email kalkacak başba bir yol düşünülecek.
	const userEmail = !!user?.email ? user.email : 'ersin@mail.com';
	return axiosInstance.post('refreshToken', { email: userEmail, refreshToken: getLS('refreshToken') });
}

axiosInstance.interceptors.request.use(
	(config) => {
		const token = getLS('accessToken');
		if (token) config.headers['Authorization'] = `Bearer ${token}`;
		// if (token) config.headers['x-access-token'] = token;

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axiosInstance.interceptors.response.use(
	(res) => {
		return res;
	},
	async (err) => {
		const originalConfig = err.config;

		if (err.response) {
			// Access Token was expired
			if (err.response.status === 401 && !originalConfig._retry) {
				originalConfig._retry = true;

				try {
					const rs = await refreshToken();
					const { user, token: accessToken } = rs.data;

					if (user) {
						setLSWithStringfyForData({ key: 'user', value: user });
						setLSWithModel({ key: 'accessToken', value: accessToken });
						setLSWithModel({ key: 'refreshToken', value: user.refresh_token });
						axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
						// axiosInstance.defaults.headers.common['x-access-token'] = accessToken;
					} else delete axiosInstance.defaults.headers.common['Authorization'];

					return axiosInstance(originalConfig);
				} catch (_error: any) {
					if (_error.response && _error.response.data) {
						return Promise.reject(_error.response.data);
					}

					return Promise.reject(_error);
				}
			}

			if (err.response.status === 403 && err.response.data) {
				return Promise.reject(err.response.data);
			}
		}

		return Promise.reject(err);
	}
);

export { axiosInstance };
export default axiosInstance;