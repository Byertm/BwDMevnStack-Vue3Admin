import { ITag } from '@models/tag';
import { useFetch } from '@utils/index';

// Todo: Axios Instance a arabir api pathler için instance oluştur.
// Todo: Axios için signal (AbortController) ve cancelToken kullanımını düşün.
const getApiUrl = (...args: any) => {
	let apiUrl: string = 'api/tag';
	if (!!args && !!args?.length) return `${apiUrl}/${args[0]}`;
	return apiUrl;
};

const getAll = async () => {
	return useFetch.get(getApiUrl());
};

const getById = async (id: string) => {
	return useFetch.get(getApiUrl(id));
};

const newTag = async (tag: Partial<ITag>) => {
	const { id, createdAt, updatedAt, ...data } = tag;
	return useFetch.post(getApiUrl(), { data: data });
};

const updateTag = async (tag: Partial<ITag>) => {
	const { id, createdAt, updatedAt, ...data } = tag;
	return useFetch.patch(getApiUrl(tag.id), { data: data });
};

const deleteTag = async (id: string) => {
	return useFetch.delete(getApiUrl(id));
};

export { getAll, getById, newTag, updateTag, deleteTag };
export default { getAll, getById, newTag, updateTag, deleteTag };