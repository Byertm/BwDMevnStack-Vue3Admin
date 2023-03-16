import { ISection, TSectionType } from '@models/section';
import { useFetch } from '@utils/index';

// Todo: Axios Instance a arabir api pathler için instance oluştur.
// Todo: Axios için signal (AbortController) ve cancelToken kullanımını düşün.
const getApiUrl = (...args: any) => {
	let apiUrl: string = 'api/section';
	if (!!args && !!args?.length) return `${apiUrl}/${args[0]}`;
	return apiUrl;
};

const getAll = async () => {
	return useFetch.get(getApiUrl());
};

const getAllByType = async (type: TSectionType) => {
	return useFetch.get(getApiUrl(`type/${type}`));
};

const getByKey = async (key: string) => {
	return useFetch.get(getApiUrl(key));
};

const getById = async (id: string) => {
	return useFetch.get(getApiUrl(`detail/${id}`));
};

const newSection = async (section: Partial<ISection>) => {
	const { id, createdAt, updatedAt, ...data } = section;
	return useFetch.post(getApiUrl(), { data: data });
};

const updateSection = async (section: Partial<ISection>) => {
	const { id, createdAt, updatedAt, ...data } = section;
	return useFetch.patch(getApiUrl(section.id), { data: data });
};

const deleteSection = async (id: string) => {
	return useFetch.delete(getApiUrl(id));
};

export { getAll, getById, getByKey, getAllByType, newSection, updateSection, deleteSection };
export default { getAll, getById, getByKey, getAllByType, newSection, updateSection, deleteSection };