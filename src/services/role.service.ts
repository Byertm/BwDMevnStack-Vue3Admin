import { IRole } from '@models/role';
import { useFetch } from '@utils/index';

// Todo: Axios Instance a arabir api pathler için instance oluştur.
// Todo: Axios için signal (AbortController) ve cancelToken kullanımını düşün.
const getApiUrl = (...args: any) => {
	let apiUrl: string = 'api/role';
	if (!!args && !!args?.length) return `${apiUrl}/${args[0]}`;
	return apiUrl;
};

const getAll = async () => {
	return useFetch.get(getApiUrl());
};

const getById = async (id: string) => {
	return useFetch.get(getApiUrl(id));
};

const newRole = async (role: Partial<IRole>) => {
	return useFetch.post(getApiUrl(), { data: { name: role.name } });
};

const updateRole = async (role: Partial<IRole>) => {
	return useFetch.patch(getApiUrl(role.id), { data: { name: role.name, isActive: role.isActive } });
};

const deleteRole = async (id: string) => {
	return useFetch.delete(getApiUrl(id));
};

export { getAll, getById, newRole, updateRole, deleteRole };
export default { getAll, getById, newRole, updateRole, deleteRole };