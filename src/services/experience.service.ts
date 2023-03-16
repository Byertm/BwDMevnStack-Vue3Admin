import { IExperience } from '@models/experience';
import { useFetch } from '@utils/index';

// Todo: Axios Instance a arabir api pathler için instance oluştur.
// Todo: Axios için signal (AbortController) ve cancelToken kullanımını düşün.
const getApiUrl = (...args: any) => {
	let apiUrl: string = 'api/experience';
	if (!!args && !!args?.length) return `${apiUrl}/${args[0]}`;
	return apiUrl;
};

const getAll = async () => {
	return useFetch.get(getApiUrl());
};

const getById = async (id: string) => {
	return useFetch.get(getApiUrl(id));
};

const newExperience = async (experience: Partial<IExperience>) => {
	const { id, createdAt, updatedAt, ...data } = experience;
	return useFetch.post(getApiUrl(), { data: data });
};

const updateExperience = async (experience: Partial<IExperience>) => {
	const { id, createdAt, updatedAt, ...data } = experience;
	return useFetch.patch(getApiUrl(experience.id), { data: data });
};

const deleteExperience = async (id: string) => {
	return useFetch.delete(getApiUrl(id));
};

export { getAll, getById, newExperience, updateExperience, deleteExperience };
export default { getAll, getById, newExperience, updateExperience, deleteExperience };