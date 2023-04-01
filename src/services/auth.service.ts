import { getLS } from '@src/composables/local-storage';
import { useFetch } from '@utils/index';
import { authLogin, authRefreshToken, authRegister } from '.';

const login = async (email: string, password: string) => {
	return useFetch.post('login', { data: { email, password } });
};

const register = async (email: string, username: string, first_name: string, last_name: string, password: string) => {
	return useFetch.post('register', { data: { email, username, first_name, last_name, password } });
};

const recoveryPassword = async (email: string) => {
	return useFetch.post('recoveryPassword', { data: { email } });
};

const me = async () => {
	return useFetch.get('me');
};

const refreshToken = async () => {
	return useFetch.post('refreshToken', { data: { refreshToken: getLS('refreshToken') } });
};

const logout = async () => {
	return useFetch.post('logout');
};

export { login as authLogin, logout, register as authRegister, refreshToken as authRefreshToken, recoveryPassword as authRecoveryPassword, me };
export default { login: authLogin, logout, register: authRegister, refreshToken: authRefreshToken, me };