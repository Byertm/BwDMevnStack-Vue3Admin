import { ISite } from '@models/site';
import { useFetch } from '@utils/index';

// Todo: Axios Instance a arabir api pathler için instance oluştur.
// Todo: Axios için signal (AbortController) ve cancelToken kullanımını düşün.
const getApiUrl = (...args: any) => {
	let apiUrl: string = 'api/site';
	if (!!args && !!args?.length) return `${apiUrl}/${args[0]}`;
	return apiUrl;
};

const get = async () => {
	return useFetch.get(getApiUrl());
};

const getAll = async () => {
	return useFetch.get(getApiUrl(`all`));
};

const getById = async (id: string) => {
	return useFetch.get(getApiUrl(id));
};

const newSite = async (site: Partial<ISite>) => {
	const { id, createdAt, updatedAt, ...data } = site;
	return useFetch.post(getApiUrl(), { data: data });
};

const updateSite = async (site: Partial<ISite>) => {
	const { id, createdAt, updatedAt, ...data } = site;
	return useFetch.patch(getApiUrl(site.id), { data: data });
};

const deleteSite = async (id: string) => {
	return useFetch.delete(getApiUrl(id));
};

export { get,getAll, getById, newSite, updateSite, deleteSite };
export default { get,getAll, getById, newSite, updateSite, deleteSite };