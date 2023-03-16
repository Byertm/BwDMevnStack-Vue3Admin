import { IEducation } from '@models/education';
import { useFetch } from '@utils/index';

// Todo: Axios Instance a arabir api pathler için instance oluştur.
// Todo: Axios için signal (AbortController) ve cancelToken kullanımını düşün.
const getApiUrl = (...args: any) => {
	let apiUrl: string = 'api/education';
	if (!!args && !!args?.length) return `${apiUrl}/${args[0]}`;
	return apiUrl;
};

const getAll = async () => {
	return useFetch.get(getApiUrl());
};

const getById = async (id: string) => {
	return useFetch.get(getApiUrl(id));
};

const newEducation = async (education: Partial<IEducation>) => {
	const { id, createdAt, updatedAt, ...data } = education;
	return useFetch.post(getApiUrl(), { data: data });
};

const updateEducation = async (education: Partial<IEducation>) => {
	const { id, createdAt, updatedAt, ...data } = education;
	return useFetch.patch(getApiUrl(education.id), { data: data });
};

const deleteEducation = async (id: string) => {
	return useFetch.delete(getApiUrl(id));
};

export { getAll, getById, newEducation, updateEducation, deleteEducation };
export default { getAll, getById, newEducation, updateEducation, deleteEducation };